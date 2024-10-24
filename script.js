// 하드코딩된 로그인 정보
const validUser = {
    employeeId: '106855', // 사번 (예시)
    password: '970301' // 비밀번호 (예시)
};

// 로그인 버튼 클릭 이벤트
document.getElementById('loginButton').addEventListener('click', function() {
    const employeeId = document.getElementById('employeeId').value;
    const password = document.getElementById('password').value;
    const loginError = document.getElementById('loginError');

    // 로그인 검증
    if (employeeId === validUser.employeeId && password === validUser.password) {
        // 로그인 성공
        loginError.textContent = '';
        document.getElementById('loginSection').style.display = 'none'; // 로그인 섹션 숨기기
        document.getElementById('voteSection').style.display = 'block'; // 투표 섹션 보이기
    } else {
        // 로그인 실패
        loginError.textContent = '사번 또는 비밀번호가 올바르지 않습니다.';
    }
});

// "투표하기" 버튼 클릭 이벤트
document.getElementById('voteStart').addEventListener('click', function() {
    // "투표하기" 버튼을 누르면 포스터 선택 화면을 보여줌
    document.getElementById('posterSelection').style.display = 'block';
    generatePosterList();
});

// 포스터 리스트 생성 함수
function generatePosterList() {
    const posterList = document.getElementById('posterList');
    const maxVotes = 3;
    const posters = 32;  // 포스터 개수

    // 기존 목록 삭제 (중복 방지)
    posterList.innerHTML = '';

    // 포스터 리스트 생성
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
}

// Google Sheets에 결과 저장하는 함수
async function saveToGoogleSheet(selectedPosters) {
    const response = await fetch('https://script.google.com/macros/s/AKfycby27yNAHDBoBcJQXuvz3zsW-yyB-1R0LqIsp09AG16lg-ULOcW1X4O9JM7h4JpHDveS/exec', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ posters: selectedPosters })
    });
    const data = await response.json();
    return data;
}

// 투표 완료 버튼 클릭 시
document.getElementById('voteForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const checkedBoxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const maxVotes = 3;  // 포스터 최대 선택 수

    if (checkedBoxes.length > maxVotes) {
        alert(`최대 ${maxVotes}개의 포스터만 선택할 수 있습니다.`);
        return;
    }

    const selectedPosters = Array.from(checkedBoxes).map(cb => cb.value);
    console.log('선택된 포스터:', selectedPosters);

    // Google Sheets에 결과 저장
    saveToGoogleSheet(selectedPosters)
        .then(() => {
            alert('투표가 완료되었습니다!');
            window.location.href = 'index.html';  // 투표 후 로그아웃
        })
        .catch(error => {
            console.error('Error saving to Google Sheets:', error);
            alert('투표 저장 중 오류가 발생했습니다.');
        });
});
