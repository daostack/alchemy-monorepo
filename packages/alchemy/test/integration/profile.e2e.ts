import { getContractAddresses, userAddresses, hideCookieAcceptWindow} from "./utils";

describe("Profile page", () => {
  let addresses;
  let daoAddress: string;
  const userAddress = userAddresses[0];

  before(async () => {
    addresses = getContractAddresses();
    daoAddress = addresses.dao.Avatar.toLowerCase();
  });

  it("should also work without a DAO address", async () => {
    await browser.url(`http://127.0.0.1:3000/profile/${userAddress}`);
    const profileContainer = await $("*[data-test-id=\"profile-container\"]");
    await profileContainer.waitForExist();
  });

  it("should exist and be editable", async () => {
    await browser.url(`http://127.0.0.1:3000/profile/${userAddress}?daoAvatarAddress=${daoAddress}`);

    const loginButton = await $("*[data-test-id=\"loginButton\"]");
    await loginButton.click();

    await hideCookieAcceptWindow();
    const title = await browser.getTitle();
    title.should.be.equal("Alchemy | DAOstack");
    const profileContainer = await $("*[data-test-id=\"profile-container\"]");
    await profileContainer.waitForExist();
    const nameInput = await $("*[id=\"nameInput\"]");
    await nameInput.waitForExist();
    await nameInput.setValue("Buster Scruggs");
    const descriptionInput = await $("#descriptionInput");
    await descriptionInput.setValue("The ballad");
    const submitButton = await $("*[type=\"submit\"]");
    await submitButton.click();
  });
});
