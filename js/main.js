﻿Object.defineProperty(console, '_commandLineAPI', { get : function() { throw '콘솔을 사용할 수 없습니다.' } });

//let server = 'http://api.teamrequin.kro.kr';
let server = "http://10.156.147.139";
// let server = window.atoa('aHR0cDovLzEwLjE1Ni4xNDcuMTM5Ojgw');
let filename = document.URL.substring(document.URL.lastIndexOf("/") + 1, document.URL.length).split('?');
filename = filename[0];
let info;
window.onload = () => {
	var btn_list = document.getElementById('header_btns_list');
	var btn = document.createElement('button');
	if(sessionStorage.getItem('token') != null) { //로그인 중
		btn_list.appendChild(btn);
		btn.setAttribute('id', 'btn_mypage');
		btn.setAttribute('class', 'btn');
		btn.setAttribute('onclick', 'mypage()');
		btn.appendChild(document.createTextNode('마이페이지'));
		btn = document.createElement('button');
		btn_list.appendChild(btn);
		btn.setAttribute('id', 'btn_logout');
		btn.setAttribute('class', 'btn');
		btn.setAttribute('onclick', 'logout()');
		btn.appendChild(document.createTextNode('로그아웃'));
	} else { //로그아웃 중
		btn_list.appendChild(btn);
		btn.setAttribute('id', 'btn_login');
		btn.setAttribute('class', 'btn');
		btn.setAttribute('onclick', 'show_login()');
		btn.appendChild(document.createTextNode('로그인'));
	}
}
function show_login() {
    document.getElementById('login_frame').style.display = 'block';
    document.getElementById('login_shadow').style.display = 'block';
	document.getElementById('login_id').focus();
}
function hide_login() {
    document.getElementById('login_frame').style.display = 'none';
    document.getElementById('login_shadow').style.display = 'none';
}
function show_signup() {
    document.getElementById('login_frame').style.display = 'none';
    document.getElementById('signup_frame').style.display = 'block';
    document.getElementById('login_shadow').style.display = 'block';
	document.getElementById('signup_name').focus();
}
function hide_signup() {
    document.getElementById('signup_frame').style.display = 'none';
    document.getElementById('login_shadow').style.display = 'none';
}
function login(event) {
	
	if(event != null && event.code != 'Enter' && event.code != 'NumpadEnter') {
		return;
	}
	var id = document.getElementById('login_id');
	var pw = document.getElementById('login_pw');
	
	var userdata = {
        'id': id.value,
        'pw': md5(pw.value)
    };
    axios.post(server+'/auth/login', userdata).then((user) => {
		alert('로그인 되었습니다');
		sessionStorage.setItem('token', user.data.access_token);
		hide_login();
		location.reload();
    }).catch(() => {
        alert('계정이 일치하지 않습니다.');
        id.value = '';
        pw.value = '';
		id.focus();
    });
}
function mypage() {
	
}
function logout() {
	var check = confirm('정말 로그아웃 하시겠습니까?');
	if(check) {
		sessionStorage.clear();
		location.reload();
	}
}
function signup_check_name() {
	var name = document.getElementById('signup-name');
	
	var data = {
		'name': name.value
	};
	
	axios.post(server+'/auth/samename', data).then(() => {
		alert('사용 가능한 닉네임입니다');
	}).catch(() => {
		alert('닉네임이 중복됩니다');
		name.value = '';
		name.focus();
	});
}
function signup_check_id() {
	var id = document.getElementById('signup_id');
	
	var data = {
		'id': id.value
	};
	
	axios.post(server+'/auth/sameaccount', data).then(() => {
		alert('사용 가능한 아이디입니다');
	}).catch(() => {
		alert('아이디가 중복됩니다');
		id.value = '';
		id.focus();
	});
}
function signup() {
	var name = document.getElementById('signup_name');
	var id = document.getElementById('signup_id');
	var pw = document.getElementById('signup_pw');
	var pw_check = document.getElementById('signup_pw_check');
	
	var data = {
		'name': name.value,
		'id': id.value,
		'pw': md5(pw.value),
		'pw_check': md5(pw_check.value)
	};
	
	axios.post(server+'/auth/register', data).then(() => {
		alert('회원가입이 완료되었습니다');
		hide_signup();
		show_login();
	}).catch(() => {
		alert('비밀번호가 일치하지 않습니다');
		pw_check.value = '';
		pw_check.focus();
	});
}
function search_user(event) {
	if(event != null && event.code != 'Enter' && event.code != 'NumpadEnter') {
		return;
	}
	var id = document.getElementById('user_id');
	
	var data = {
		'search_id': id.value
	};
	
	axios.post(server+'/service/search-user', data).then(() => {
		location.href = '/quiz/quiz_list.php?user='+id.value;
	}).catch(() => {
		alert('존재하지 않는 유저입니다');
		id.focus();
	});
}
function getUrlPar(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
        results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}