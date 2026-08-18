# SR Academy 홈페이지

빌더 없이 직접 고칠 수 있는 정적 홈페이지입니다. HTML·CSS·JS만 쓰기 때문에
GitHub Pages에 그대로 올리면 무료로 운영됩니다.

## 폴더 구성

```
index.html          Greetings (첫 화면)
why-sr.html         Why SR?
pedagogy.html       Pedagogy
books.html          SR Books
levels.html         SR Levels  ← 책등을 누르면 내용이 바뀝니다
debate-camp.html    Debate Camp
reviews.html        졸업생 후기
location.html       찾아오시는 길
assets/css/style.css   색·글꼴·여백 전부 여기
assets/js/main.js      메뉴, 스크롤 효과, 레벨 탭
assets/img/            사진 넣는 곳
```

---

## 1. GitHub에 올리기

### 방법 A — 웹에서 (터미널 없이)

1. github.com 로그인 → 오른쪽 위 **+** → **New repository**
2. 이름을 `sr-academy`로 하고 **Public** 선택 → **Create repository**
3. 다음 화면에서 **uploading an existing file** 클릭
4. 이 폴더 안의 **모든 파일과 폴더를 통째로 드래그**해서 올리고 **Commit changes**

### 방법 B — 터미널에서

```bash
cd sr-academy
git init
git add .
git commit -m "SR Academy 홈페이지 첫 버전"
git branch -M main
git remote add origin https://github.com/내아이디/sr-academy.git
git push -u origin main
```

## 2. 사이트 켜기 (GitHub Pages)

1. 저장소 → **Settings** → 왼쪽 메뉴 **Pages**
2. Source를 **Deploy from a branch**로 두고, Branch는 **main** / **/ (root)** 선택 → **Save**
3. 1~2분 뒤 `https://내아이디.github.io/sr-academy/` 주소로 열립니다

## 3. 도메인 연결 (선택)

이미 갖고 계신 도메인을 쓰려면:

1. Settings → Pages → **Custom domain**에 도메인 입력 후 저장
2. 도메인 등록업체(가비아 등) DNS에 추가
   - `A` 레코드 4개: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - 또는 `www`용 `CNAME` 레코드: `내아이디.github.io`
3. **Enforce HTTPS** 체크

---

## 4. 내용 고치는 법

### 글자 바꾸기
HTML 파일을 열어 한글 문장을 그대로 고치면 됩니다. 태그(`<p>` 같은 꺾쇠 부분)는 건드리지 마세요.

### 색·글꼴 바꾸기
`assets/css/style.css` 맨 위 `:root` 안의 값만 고치면 사이트 전체가 한 번에 바뀝니다.

```css
--bottle: #0E3B2C;    /* 진한 초록 (첫 화면, 푸터) */
--marigold: #C88A1A;  /* 강조색 (밑줄, 버튼) */
--sage: #E6ECE3;      /* 페이지 배경 */
```

### 유튜브 영상 바꾸기
`index.html`에서 `VIDEO_ID` 부분을 실제 영상 주소의 ID로 바꾸세요.
`youtube.com/watch?v=**abc123**` → `abc123`

### 레벨 내용 바꾸기
`levels.html`의 `<button class="spine" ...>` 안에 있는
`data-title`, `data-desc`, `data-grade`, `data-books`, `data-writing` 값을 고치면 됩니다.
레벨을 더 늘리려면 `<button>` 블록을 통째로 복사해서 붙여 넣으세요.

### 메뉴 바꾸기
메뉴는 8개 HTML 파일에 각각 들어 있습니다. 한 곳을 고쳤으면
`<!-- ▼ 상단 바 -->`부터 `<!-- ▲ 상단 바 끝 -->`까지를 복사해 나머지 파일에도 붙여 넣으세요.

---

## 5. 꼭 바꿔야 할 자리

지금은 예시 값이 들어 있습니다. 실제 정보로 교체하세요.

- [ ] 전화번호 `032-000-0000`, `031-000-0000`
- [ ] 주소 (`location.html`)
- [ ] 이메일 `hello@example.com`
- [ ] 유튜브 `VIDEO_ID`
- [ ] 레벨별 학년·도서·과제 (`levels.html`)
- [ ] 졸업생 후기 (`reviews.html`)
- [ ] 도서 목록 (`books.html`)
- [ ] 네이버 지도 삽입 코드 (`location.html`)
