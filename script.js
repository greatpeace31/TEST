// 사번과 비밀번호 데이터를 하드코딩
const users = [
    { empId: '106855', password: '970301' },
    { empId: '1002', password: '950505' },
    { empId: '1003', password: '870321' }
];

// 로그인 로직
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const empId = document.getElementById('empId').value;
    const password = document.getElementById('password').value;

    // 하드코딩된 사용자 데이터와 일치하는지 확인
    const user = users.find(user => user.empId === empId && user.password === password);

    if (user) {
        // 로그인 성공 -> 투표 페이지로 이동
        sessionStorage.setItem('empId', empId);
        window.location.href = 'vote.html';
    } else {
        // 로그인 실패 시 경고 메시지
        alert('잘못된 사번 또는 비밀번호입니다.');
    }
});

// 투표 로직
if (window.location.pathname.endsWith('vote.html')) {
    const maxVotes = 3;
    const posters = 32;

    // 포스터 리스트 동적으로 생성
    const posterList = document.getElementById('posterList');
    for (let i = 1; i <= posters; i++) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'poster' + i;
        checkbox.value = i;

        const label = document.createElement('label');
        label.htmlFor = 'poster' + i;
        label.innerText = '포스터 ' + i;

        const br = document.createElement('br');
        posterList.appendChild(checkbox);
        posterList.appendChild(label);
        posterList.appendChild(br);
    }

    // 투표 폼 제출 시 처리
    document.getElementById('voteForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const checkedBoxes = document.querySelectorAll('input[type="checkbox"]:checked');
        if (checkedBoxes.length > maxVotes) {
            alert(`최대 ${maxVotes}개 포스터에만 투표할 수 있습니다.`);
            return;
        }

        // 선택한 포스터 저장 (Firebase 또는 Google Sheets로 전송)
        const selectedPosters = Array.from(checkedBoxes).map(cb => cb.value);
        console.log('선택된 포스터:', selectedPosters);

        // 이후 Firebase 또는 Google Sheets로 데이터 전송 로직 추가 가능

        alert('투표가 완료되었습니다.');
        sessionStorage.clear();  // 세션 초기화
        window.location.href = 'index.html';  // 투표 후 로그아웃
    });

    // 자동 로그아웃 기능: 페이지 이탈 시 로그아웃
    window.addEventListener('beforeunload', function() {
        sessionStorage.clear();
    });
}