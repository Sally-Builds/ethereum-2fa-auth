const TwoFactorAuth = artifacts.require('TwoFactorAuth.sol')






module.exports = function (deployer) {
    deployer.deploy(TwoFactorAuth)
}