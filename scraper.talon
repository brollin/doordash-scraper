tag: browser
browser.host: www.doordash.com
-

scrape door:
    # requires creating the reference first
    # "mark air bat as json"
    user.rango_run_action_on_reference("focusElement", "json")
    sleep(1000ms)
    key(cmd-a)
    sleep(100ms)
    edit.copy()
    sleep(100ms)
    user.scraper_perform_scrape()
