import os
from pathlib import Path

import pytest
from dotenv import load_dotenv
from selenium import webdriver
from selenium.webdriver.chrome.options import Options


ROOT = Path(__file__).resolve().parents[1]
REPORTS = ROOT / "reports"
load_dotenv(ROOT / ".env")


def pytest_configure(config):
    REPORTS.mkdir(parents=True, exist_ok=True)
    (REPORTS / "screenshots").mkdir(parents=True, exist_ok=True)


def pytest_collection_modifyitems(config, items):
    if os.getenv("LMS_RUN_SELENIUM", "").lower() == "true" or os.getenv("LMS_RUN_SELENIUM") == "1":
        return
    skip = pytest.mark.skip(reason="Set LMS_RUN_SELENIUM=1 to run browser tests against the configured app.")
    for item in items:
        item.add_marker(skip)


@pytest.fixture
def base_url():
    return os.getenv("LMS_BASE_URL", "http://localhost:3000").rstrip("/")


@pytest.fixture
def driver(request):
    options = Options()
    if os.getenv("LMS_HEADLESS", "true").lower() != "false":
        options.add_argument("--headless=new")
    options.add_argument("--window-size=1440,1000")
    options.add_argument("--disable-notifications")
    options.add_argument("--disable-dev-shm-usage")
    browser = webdriver.Chrome(options=options)
    browser.implicitly_wait(0)
    yield browser
    browser.quit()


@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    report = outcome.get_result()
    if report.when == "call" and report.failed:
        browser = item.funcargs.get("driver")
        if browser:
            safe_name = "".join(char if char.isalnum() or char in "-_" else "_" for char in item.nodeid)
            screenshot = REPORTS / "screenshots" / f"{safe_name}.png"
            try:
                browser.save_screenshot(str(screenshot))
                report.sections.append(("Failure screenshot", str(screenshot)))
            except Exception as error:  # browser may already have closed
                report.sections.append(("Failure screenshot error", str(error)))
