from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import Select
import time

chrome_options = Options()
url = "http://localhost:5080/openmeetings/signin"
d = webdriver.Chrome(executable_path=r'C:\chromedriver.exe', chrome_options=chrome_options)
d.get(url)

d.find_element_by_xpath('//*[@id="btn109"]').click



