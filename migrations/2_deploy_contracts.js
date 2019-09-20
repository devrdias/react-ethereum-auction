var Ownable = artifacts.require("./zeppelin/ownership/Ownable.sol");
var Killable = artifacts.require("./zeppelin/lifecycle/Killable.sol");
var SafeMath = artifacts.require("./zeppelin/math/SafeMath.sol");
var ReentryProtector = artifacts.require("./ReentryProtector.sol");
var Authentication = artifacts.require("./Authentication.sol");
var Ecommerce = artifacts.require("./Ecommerce.sol");
var Escrow = artifacts.require("./Escrow.sol");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(Ownable);
  deployer.deploy(Killable);
  deployer.deploy(SafeMath);
  deployer.deploy(ReentryProtector);
  deployer.deploy(Escrow, 0, "0x0", "0x0", "0x0");

  deployer.link(SafeMath, Ecommerce);
  deployer.link(ReentryProtector, Ecommerce);
  deployer.link(Escrow, Ecommerce);

  let ecommerce;
  let authentication;
  deployer.deploy(Ecommerce).then(function(depEcommerce) {
    ecommerce = depEcommerce;
    deployer.link(Ownable, Authentication);
    deployer.link(Killable, Authentication);
    deployer.link(SafeMath, Authentication);
    deployer.link(ReentryProtector, Authentication);
    deployer.link(Ecommerce, Authentication);
    return deployer.deploy(Authentication, depEcommerce.address );
  }).then((ans) => {
    authentication = ans;
    return ans;
  });
};