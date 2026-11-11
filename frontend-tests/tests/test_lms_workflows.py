import os
import uuid
from datetime import datetime, timedelta
from urllib.parse import urlparse

import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


WAIT_SECONDS = 12


def wait_for(driver, condition, timeout=WAIT_SECONDS):
    return WebDriverWait(driver, timeout).until(condition)


def visible_button(driver, text):
    return wait_for(
        driver,
        lambda browser: next(
            reversed([
                button for button in browser.find_elements(By.TAG_NAME, "button")
                if button.is_displayed() and text.lower() in button.text.strip().lower()
            ]),
            False,
        ),
    )


def sign_in(driver, base_url, role, email=None, password=None):
    email = email or os.getenv(f"LMS_TEST_{role.upper()}_EMAIL")
    password = password or os.getenv(f"LMS_TEST_{role.upper()}_PASSWORD")
    if not email or not password:
        pytest.skip(f"Set LMS_TEST_{role.upper()}_EMAIL and LMS_TEST_{role.upper()}_PASSWORD.")

    driver.get(f"{base_url}/login")
    wait_for(driver, EC.visibility_of_element_located((By.CSS_SELECTOR, 'input[type="email"]')))
    visible_button(driver, role.title()).click()
    driver.find_element(By.CSS_SELECTOR, 'input[type="email"]').send_keys(email)
    driver.find_element(By.CSS_SELECTOR, 'input[type="password"]').send_keys(password)
    if role.lower() == "admin":
        code = os.getenv("LMS_TEST_ADMIN_SECRET_CODE")
        if not code:
            pytest.skip("Set LMS_TEST_ADMIN_SECRET_CODE for administrator login tests.")
        driver.find_element(By.CSS_SELECTOR, 'input[placeholder="Enter institutional admin code"]').send_keys(code)
    visible_button(driver, f"Enter {role.title()} workspace").click()
    wait_for(driver, lambda browser: f"/{role.lower()}" in browser.current_url)


def require_test_mutations(base_url):
    if os.getenv("LMS_TEST_DB_CONFIRMED", "").lower() != "true" or os.getenv("LMS_TEST_ALLOW_MUTATIONS", "").lower() != "true":
        pytest.skip("Mutation tests require LMS_TEST_DB_CONFIRMED=true and LMS_TEST_ALLOW_MUTATIONS=true.")
    host = urlparse(base_url).hostname
    if host not in {"localhost", "127.0.0.1", "::1"}:
        pytest.fail("Mutation tests are restricted to localhost to avoid changing remote or production data.")


def open_course(driver, base_url):
    course_id = os.getenv("LMS_TEST_COURSE_ID")
    if not course_id:
        pytest.skip("Set LMS_TEST_COURSE_ID to a seeded course in the test database.")
    driver.get(f"{base_url}/courses/{course_id}")
    wait_for(driver, EC.visibility_of_element_located((By.CSS_SELECTOR, "main")))


def select_course_tab(driver, label):
    visible_button(driver, label).click()


def sign_out(driver):
    sign_out_button = next(
        (button for button in driver.find_elements(By.TAG_NAME, "button")
         if button.is_displayed() and "sign out" in button.text.strip().lower()),
        None,
    )
    if sign_out_button is None:
        profile_button = wait_for(
            driver,
            lambda browser: next(
                (button for button in browser.find_elements(By.XPATH, "//button[.//span[contains(@class, 'max-w')]]")
                 if button.is_displayed()),
                False,
            ),
        )
        profile_button.click()
        sign_out_button = visible_button(driver, "Sign out")
    sign_out_button.click()
    wait_for(driver, lambda browser: "/login" in browser.current_url or "/" == urlparse(browser.current_url).path)


def test_public_course_catalog_loads(driver, base_url):
    driver.get(f"{base_url}/courses")
    wait_for(driver, EC.visibility_of_element_located((By.CSS_SELECTOR, "main")))
    wait_for(driver, lambda browser: "Course Catalog" in browser.find_element(By.TAG_NAME, "body").text
             or "Explore" in browser.find_element(By.TAG_NAME, "body").text)


def test_invalid_login_shows_error_without_authenticating(driver, base_url):
    driver.get(f"{base_url}/login")
    wait_for(driver, EC.visibility_of_element_located((By.CSS_SELECTOR, 'input[type="email"]')))
    driver.find_element(By.CSS_SELECTOR, 'input[type="email"]').send_keys("wrong.user@example.invalid")
    driver.find_element(By.CSS_SELECTOR, 'input[type="password"]').send_keys("IncorrectPassword!123")
    visible_button(driver, "Enter Student workspace").click()
    wait_for(driver, lambda browser: "/login" in browser.current_url)
    wait_for(
        driver,
        lambda browser: any(
            message in browser.find_element(By.TAG_NAME, "body").text.lower()
            for message in ("invalid", "incorrect", "not found")
        ),
    )


def test_protected_page_redirects_anonymous_user(driver, base_url):
    driver.get(f"{base_url}/faculty")
    wait_for(driver, lambda browser: "/login" in browser.current_url)


@pytest.mark.parametrize("role", ["student", "faculty", "admin"])
def test_role_dashboard_and_logout(driver, base_url, role):
    sign_in(driver, base_url, role)
    assert urlparse(driver.current_url).path.rstrip("/") == f"/{role}"
    sign_out(driver)


@pytest.mark.mutating
def test_register_new_student(driver, base_url):
    require_test_mutations(base_url)
    password = os.getenv("LMS_TEST_NEW_USER_PASSWORD")
    if not password:
        pytest.skip("Set LMS_TEST_NEW_USER_PASSWORD for registration workflow tests.")
    driver.get(f"{base_url}/register")
    wait_for(driver, EC.visibility_of_element_located((By.CSS_SELECTOR, 'input[type="email"]')))
    email = f"selenium.{uuid.uuid4().hex[:10]}@example.test"
    fields = driver.find_elements(By.CSS_SELECTOR, "input")
    # Registration inputs are ordered: name, email, phone, password, confirmation.
    fields[0].send_keys("Selenium Student")
    fields[1].send_keys(email)
    fields[2].send_keys("9876543210")
    fields[3].send_keys(password)
    fields[4].send_keys(password)
    driver.find_element(By.CSS_SELECTOR, 'input[type="checkbox"]').click()
    visible_button(driver, "Register as Student").click()
    wait_for(driver, lambda browser: "/student" in browser.current_url)


@pytest.mark.mutating
def test_student_enrollment_material_quiz_attendance_and_progress(driver, base_url):
    require_test_mutations(base_url)
    sign_in(driver, base_url, "student")
    open_course(driver, base_url)

    body = driver.find_element(By.TAG_NAME, "body").text
    if "Enroll in Course" in body:
        visible_button(driver, "Enroll in Course").click()
        wait_for(driver, lambda browser: "Enrolled" in browser.find_element(By.TAG_NAME, "body").text)

    select_course_tab(driver, "Modules & Content")
    wait_for(driver, lambda browser: "Course Curriculum" in browser.find_element(By.TAG_NAME, "body").text)
    body = driver.find_element(By.TAG_NAME, "body").text
    assert "Video Lecture" in body or "Recorded Lecture" in body
    video_title = wait_for(
        driver,
        EC.visibility_of_element_located((By.XPATH, "//*[contains(text(), 'Recorded Lecture: Bayesian Inference')][1]")),
    )
    video_title.click()
    wait_for(driver, EC.visibility_of_element_located((By.CSS_SELECTOR, "video[controls]")))
    assert driver.find_element(By.CSS_SELECTOR, "video[controls]").get_attribute("src")
    driver.find_element(By.CSS_SELECTOR, 'button[aria-label="Close modal"]').click()

    select_course_tab(driver, "Timed Quizzes")
    wait_for(driver, lambda browser: "Timed Course Quizzes" in browser.find_element(By.TAG_NAME, "body").text)
    start_quiz = next(
        (button for button in driver.find_elements(By.TAG_NAME, "button")
         if button.is_displayed() and button.text.strip() in {"Start Assessment", "Start Attempt", "Continue Attempt"}),
        None,
    )
    if start_quiz:
        start_quiz.click()
        wait_for(driver, lambda browser: "Examination Instructions & Protocol" in browser.find_element(By.TAG_NAME, "body").text)
        visible_button(driver, "Cancel & Return").click()
    select_course_tab(driver, "Attendance")
    wait_for(driver, lambda browser: "Derived Attendance %" in browser.find_element(By.TAG_NAME, "body").text)


@pytest.mark.mutating
def test_faculty_assignment_quiz_announcement_and_discussion_creation(driver, base_url):
    require_test_mutations(base_url)
    sign_in(driver, base_url, "faculty")
    open_course(driver, base_url)
    unique = uuid.uuid4().hex[:8]

    select_course_tab(driver, "Assignments")
    visible_button(driver, "+ New Assignment").click()
    form = wait_for(driver, EC.visibility_of_element_located((By.XPATH, "//form[.//button[contains(., 'Publish Assignment')]]")))
    form.find_element(By.CSS_SELECTOR, 'input[type="text"]').send_keys(f"Selenium Assignment {unique}")
    due = (datetime.now() + timedelta(days=2)).strftime("%Y-%m-%dT%H:%M")
    form.find_element(By.CSS_SELECTOR, 'input[type="datetime-local"]').send_keys(due)
    form.find_element(By.CSS_SELECTOR, 'button[type="submit"]').click()
    wait_for(driver, lambda browser: f"Selenium Assignment {unique}" in browser.find_element(By.TAG_NAME, "body").text)

    select_course_tab(driver, "Timed Quizzes")
    visible_button(driver, "Author New Quiz").click()
    quiz_form = wait_for(driver, EC.visibility_of_element_located((By.XPATH, "//form[.//button[contains(., 'Publish Quiz')]]")))
    quiz_form.find_element(By.CSS_SELECTOR, 'input[placeholder^="e.g. Midterm Assessment"]').send_keys(f"Selenium Quiz {unique}")
    quiz_form.find_element(By.CSS_SELECTOR, 'button[type="submit"]').click()
    wait_for(driver, lambda browser: f"Selenium Quiz {unique}" in browser.find_element(By.TAG_NAME, "body").text)

    select_course_tab(driver, "Announcements")
    visible_button(driver, "+ Post Announcement").click()
    driver.find_element(By.CSS_SELECTOR, 'input[placeholder="Announcement Title"]').send_keys(f"Selenium Notice {unique}")
    driver.find_element(By.CSS_SELECTOR, 'textarea[placeholder="Announcement message..."]').send_keys("Automated test announcement.")
    visible_button(driver, "Publish").click()
    wait_for(driver, lambda browser: f"Selenium Notice {unique}" in browser.find_element(By.TAG_NAME, "body").text)

    select_course_tab(driver, "Discussions")
    visible_button(driver, "+ New Discussion Thread").click()
    driver.find_element(By.CSS_SELECTOR, 'input[placeholder^="Thread Title or Question"]').send_keys(f"Selenium Discussion {unique}")
    driver.find_element(By.CSS_SELECTOR, 'textarea[placeholder^="Write your question or discussion prompt"]').send_keys("Automated test discussion prompt.")
    visible_button(driver, "Post Thread").click()
    wait_for(driver, lambda browser: f"Selenium Discussion {unique}" in browser.find_element(By.TAG_NAME, "body").text)


@pytest.mark.mutating
def test_student_assignment_submission(driver, base_url):
    require_test_mutations(base_url)
    sign_in(driver, base_url, "student")
    open_course(driver, base_url)
    select_course_tab(driver, "Assignments")
    visible_button(driver, "Submit Assignment").click()
    url = os.getenv("LMS_TEST_SUBMISSION_URL", "https://example.test/selenium-submission")
    field = wait_for(driver, EC.visibility_of_element_located((By.CSS_SELECTOR, 'input[type="url"]')))
    field.send_keys(url)
    modal_form = field.find_element(By.XPATH, "ancestor::form")
    modal_form.find_element(By.CSS_SELECTOR, 'button[type="submit"]').click()
    wait_for(driver, lambda browser: "Previous Submission" in browser.find_element(By.TAG_NAME, "body").text
             or "SUBMITTED" in browser.find_element(By.TAG_NAME, "body").text)
