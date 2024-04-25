import json
from datetime import datetime
from talon import Module, actions, app, clip
from pathlib import Path

mod = Module()

CURRENT_DIRECTORY = Path(__file__).parent
DATA_DIRECTORY = CURRENT_DIRECTORY / "data"


def persist_data():
    data = clip.text()
    parsed_data = json.loads(data)

    # find order id
    order_id = parsed_data["props"]["pageProps"]["pageProps"]["orderUuid"]

    # find date of order
    order_timestamp = parsed_data["props"]["pageProps"]["pageProps"]["consumerOrders"][
        "delivery"
    ]["createdAt"]
    order_date = datetime.fromtimestamp(order_timestamp).strftime("%Y-%m-%d")

    # Save data to a file in the current directory
    with open(DATA_DIRECTORY / f"{order_date}_{order_id}.json", "w") as file:
        file.write(data)

    app.notify("Scraped!")


@mod.action_class
class Actions:
    def scraper_perform_scrape():
        """Performs scrape"""
        persist_data()
