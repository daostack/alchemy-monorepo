import { getContractAddresses, hideCookieAcceptWindow } from "./utils";

describe("Header redemptions button", () => {
  it("shouldn't be there if the user isn't logged in", async () => {
    await browser.url("http://127.0.0.1:3000");

    const redemptionsButton = await $("[data-test-id=\"redemptionsButton\"]");
    (await redemptionsButton.isDisplayed()).should.equal(false);
  });

  it("should show a quick menu on desktop devices", async () => {

    const loginButton = await $("[data-test-id=\"loginButton\"]");
    await loginButton.click();

    await hideCookieAcceptWindow();
    const redemptionsButton = await $("[data-test-id=\"redemptionsButton\"]");
    await redemptionsButton.waitForDisplayed();
    await redemptionsButton.click();

    const viewAllRedemptionsLink = await $("[data-test-id=\"viewAllRedemptionsLink\"]");
    await viewAllRedemptionsLink.waitForDisplayed();
    await viewAllRedemptionsLink.click();
  });
});

describe("Redemptions page", () => {
  let testAddresses: any;

  before(() => {
    testAddresses = getContractAddresses();
  });

  it("should exist", async () => {
    await browser.url("http://127.0.0.1:3000/redemptions");

    const pageTitle = await browser.getTitle();
    pageTitle.should.be.equal("Alchemy | DAOstack");
  });

  it("should redeem a reward", async () => {
    await browser.url("http://127.0.0.1:3000/redemptions");
    await hideCookieAcceptWindow();

    const proposalId = testAddresses.test.executedProposalId;
    const proposalCard = await $(`[data-test-id="proposal-${proposalId}"]`);
    await proposalCard.waitForExist();

    const redeemButton = await $("[data-test-id=\"button-redeem\"]");
    await redeemButton.click();

    const launchMetaMaskButton = await $("[data-test-id=\"launch-metamask\"]");
    await launchMetaMaskButton.click();
  });
});
