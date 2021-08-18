const PasswordSecurityClient = require('@kihyeon-hong/password_security_client');
var pwd = new PasswordSecurityClient.PasswordSecurity.PasswordSecurity();

// pwd.serverAddressUpdate('100.25.199.10:65001');

// pwd.passwordModelDistribution('0.2', 'test comment');

pwd.passwordValidation('pds$66wo@d').then(function (result) {
    console.log(result);

    pwd.passwordValidation('q1w2e3r4').then(function (result) {
        console.log(result);
    });
});
