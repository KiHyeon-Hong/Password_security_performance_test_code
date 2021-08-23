/*
 * 평가 항목: 키보안 레벨 정확도
 * 시험 내용: 인공지능 출입키 암호검증 모듈은 비밀번호가 유추당할 확률을 측정하여 보안 수준을 측정한다.
 * 이를 시험하기 위해 무작위로 수집한 비밀번호 목록에 대해 검증을 수행하도록 하고, 미리 정해 둔 각 비밀번호 보안 수준에 대해 올바른 판단을 내리는지 수행한다.
 * 비밀번호 1개당 10회 검증을 수행하며, 모두 올바른 결과로 출력하는지 확인한다.
 */

const PasswordSecurityClient = require('@kihyeon-hong/password_security_client');
const fs = require('fs');

var passwordClient = new PasswordSecurityClient.PasswordSecurity.PasswordSecurity();

var oriDatas = fs.readFileSync(__dirname + '/../files/updateLeakPasswordFeatures.txt', 'utf8');
oriDatas = oriDatas.split('\n');

var datas = [];
for (let i = 0; i < oriDatas.length; i++) {
    datas[i] = oriDatas[i].split('\r')[0];
}

var leakString = [];
var leakDataValue = [];

for (let i = 0; i < datas.length - 1; i++) {
    leakString[i] = datas[i].split(',')[0];
    leakDataValue[i] = 0;
}

oriDatas = fs.readFileSync(__dirname + '/../files/updateNotLeakPasswordFeatures.txt', 'utf8');
oriDatas = oriDatas.split('\n');

datas = [];
for (let i = 0; i < oriDatas.length; i++) {
    datas[i] = oriDatas[i].split('\r')[0];
}

var notLeakString = [];
var notLeakDataValue = [];

for (let i = 0; i < datas.length - 1; i++) {
    notLeakString[i] = datas[i].split(',')[0];
    notLeakDataValue[i] = 1;
}

fs.writeFileSync(__dirname + '/../files/performanceTestLog.log', '', 'utf8');

async function performanceTest() {
    let success = 0;
    let fail = 0;

    for (let i = 0; i < 100; i++) {
        let testPassword = '';
        let testLeakCount = 0;

        if (i % 2 == 0) {
            testPassword = leakString[Math.floor(Math.random() * leakString.length)];
            testLeakCount = 0;
        } else {
            testPassword = notLeakString[Math.floor(Math.random() * notLeakString.length)];
            testLeakCount = 1;
        }

        fs.appendFileSync(
            __dirname + '/../files/performanceTestLog.log',
            `=== 테스트 데이터: ${testPassword}, 실제 유출 여부: ${testLeakCount == 0 ? '유출된 비밀번호' : '유출되지 않은 비밀번호'} ===\n`,
            'utf8'
        );
        console.log(`=== 테스트 데이터: ${testPassword}, 실제 유출 여부: ${testLeakCount == 0 ? '유출된 비밀번호' : '유출되지 않은 비밀번호'} ===`);

        for (let j = 0; j < 10; j++) {
            await passwordClient.passwordValidation(testPassword).then(function (result) {
                console.log(result);

                fs.appendFileSync(
                    __dirname + '/../files/performanceTestLog.log',
                    `${j + 1} 번째 유출 여부 예측: ${result.predictPoint < 0.6 ? '유출된 비밀번호' : '유출되지 않은 비밀번호'}\n`,
                    'utf8'
                );
                console.log(`${j + 1} 번째 유출 여부 예측: ${result.predictPoint < 0.6 ? '유출된 비밀번호' : '유출되지 않은 비밀번호'}`);

                if (j == 9) {
                    if ((testLeakCount == 0 ? true : false) == (result.predictPoint < 0.6 ? true : false)) {
                        fs.appendFileSync(__dirname + '/../files/performanceTestLog.log', `=== 예측 성공 여부: ${'예측 성공'} ===\n\n`, 'utf8');
                        console.log(`=== 예측 성공 여부: ${'예측 성공'} ===\n\n`);

                        success++;
                    } else {
                        fs.appendFileSync(__dirname + '/../files/performanceTestLog.log', `=== 예측 성공 여부: ${'예측 실패'} ===\n\n`, 'utf8');
                        console.log(`=== 예측 성공 여부: ${'예측 실패'} ===\n\n`);

                        fail++;
                    }
                }
            });
        }
    }

    fs.appendFileSync(__dirname + '/../files/performanceTestLog.log', `예측 성공: ${success}회, 예측 실패: ${fail}회, 예측 정확도 ${(success / (success + fail)) * 100}%`, 'utf8');
    console.log(`예측 성공: ${success}회, 예측 실패: ${fail}회, 예측 정확도 ${(success / (success + fail)) * 100}%`);
}

performanceTest();