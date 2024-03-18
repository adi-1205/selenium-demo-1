const { Browser, Builder, By, Key } = require('selenium-webdriver');

async function main() {
    let driver

    try {
        let pagesVisited = 1
        let toysLinks = []
        let currentPage
        const productReviews = []

        driver = await new Builder().forBrowser(Browser.CHROME).build()

        await driver.get('https://www.flipkart.com/')

        let el = await driver.findElement(By.name('q'))
        await el.sendKeys('toys', Key.RETURN)

        while (pagesVisited <= 2) {
            currentPage = await driver.getCurrentUrl()

            if (pagesVisited != 1) {
                let nextPage = await getNextPage()
                await driver.get(nextPage)
            }

            let toys = await driver.findElements(By.className('_4ddWXP'));
            toys = toys.slice(0, 3)

            for (const toy of toys) {
                let link = await toy.findElement(By.className('s1Q9rs')).getAttribute('href')
                let title = await toy.findElement(By.className('s1Q9rs')).getAttribute('title')
                toysLinks.push({ title, link })
            }

            for (const { link, title } of toysLinks) {
                let productReview = {}
                productReview.title = title
                productReview.reviews = []
                await driver.get(link)
                let reviewEls = await driver.findElements(By.className('t-ZTKy'))
                for (const reviewEl of reviewEls) {
                    let review = await reviewEl.getText()
                    if (review)
                        productReview.reviews.push(review)
                }
                productReviews.push(productReview)
            }

            pagesVisited += 1
            toysLinks = []
            await driver.get(currentPage)

        }

        async function getNextPage() {
            let page = await driver.findElement(By.css('._2Kfbh8 + a'))
            return await page.getAttribute('href');
        }

        console.log(productReviews);

    } catch (err) {
        console.log(err);
    } finally {
        await driver.quit()
    }
}

main()
