function getCookieValue(key) {
    let cookieKey = key + "=";
    let result = "";
    const cookieArr = document.cookie.split(";");

    for (let i = 0; i < cookieArr.length; i++) {
        if (cookieArr[i][0] === " ") {
            cookieArr[i] = cookieArr[i].substring(1);
        }

        if (cookieArr[i].indexOf(cookieKey) === 0) {
            result = cookieArr[i].slice(cookieKey.length, cookieArr[i].length);
            return result;
        }
    }
    //console.log(result);
    return result;
}

var google_name;
LoginLink = document.getElementById("LoginLink");
SignupLink = document.getElementById("SignupLink");

function requestInfo(accessToken) {
    console.log("requesting...")
    $.ajax({
        url: 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
        },
        success: function (data) {
            console.log(data)
            console.log("이것은 네임!!! " + data.name)
            google_name = data.name;
            globalusername = google_name;
            console.log("이것은 구글네임!!! " + google_name)

            // 구글 사용자 이름 출력
            if (google_name) {
                console.log("googlename is notnull")
                LoginLink.innerHTML = google_name + " in Google Account";
                SignupLink.style.display = "none";
            } else {
                LoginLink.innerHTML = "Login";
                SignupLink.style.display = "";
            }

        },
        error: function (error) {
            console.log(error);
        },
    });
}


const googleToken = getCookieValue('googleToken');
// googleToken 을 쿠키에서 가져온후 변수에 할당 
console.log("이것은 구글 토큰 : " + googleToken);
// ajax 요청

// innerHTML로 삽입