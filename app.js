
// app.js : 영화 검색과 정렬 / 김재호(26) / 12주차

// 포스터 주소 생성
function posterUrl(path, size) {
    return "https://image.tmdb.org/t/p/" + size + path;
}

// 평균 평점
function average(list) {
    let sum = 0;

    for (const m of list) {
        sum += m.rating;
    }

    return sum / list.length;
}

console.log("평균:", average(movies));

// 최고 평점 영화
function best(list) {
    let top = list[0];

    for (const m of list) {
        if (m.rating > top.rating) {
            top = m;
        }
    }

    return top;
}

console.log("최고:", best(movies).title);

// 평점 필터
function filterByRating(list, min) {
    return list.filter(m => m.rating >= min);
}

console.log("8점 이상:", filterByRating(movies, 8).length + "편");

// 평점순 정렬
function sortByRating(list) {
    return [...list].sort((a, b) => b.rating - a.rating);
}

const sorted = sortByRating(movies);

console.log(
    "정렬 1위:", sorted[0].title,
    "/ 원본 1번:", movies[0].title
);

// 개봉 후 지난 연도
function yearsSince(dateStr) {
    return new Date().getFullYear() -
        new Date(dateStr).getFullYear();
}

console.log(yearsSince(movies[0].date) + "년 전 개봉");

// 영화 배열 정렬
const sortBy = (list, key, desc) => {
    const copy = [...list];

    copy.sort((a, b) => {
        if (typeof a[key] === "string") {
            return a[key].localeCompare(b[key]);
        }

        return a[key] - b[key];
    });

    if (desc) {
        copy.reverse();
    }

    return copy;
};

// 검색과 정렬을 함께 처리
function getView() {
    const keyword = document
        .getElementById("q")
        .value
        .trim()
        .toLowerCase();

    const found = movies.filter(m =>
        m.title.toLowerCase().includes(keyword)
    );

    const key = document.getElementById("sort").value;

    return sortBy(found, key, key !== "title");
}

// 좋아요 개수 업데이트
function updateLikeCount() {
    const count = document.querySelectorAll(".liked").length;

    document.getElementById("likeCount").textContent =
        "찜 " + count + "편";
}

// 영화 카드 생성
const renderCards = (list) => {
    const board = document.querySelector(".board");

    board.innerHTML = "";

    for (const m of list) {
        const card = document.createElement("article");

        card.className = "card";

        if (m.rating >= 8) {
            card.classList.add("hot");
        }

        card.innerHTML = `
            <img class="poster"
                src="${posterUrl(m.poster, "w342")}"
                alt="${m.title} 포스터">

            <span class="badge">${m.rating}</span>

            <div class="info">
                <h2>${m.title}</h2>
                <p class="year">${m.year}</p>
                <button class="like" type="button">♥</button>
            </div>
        `;

        board.appendChild(card);
    }

    // 영화 개수 표시
    document.getElementById("count").textContent =
        list.length + "편";

    // 검색 결과가 없는 경우
    if (list.length === 0) {
        board.classList.add("is-empty");
    } else {
        board.classList.remove("is-empty");
    }

    // 좋아요 개수 업데이트
    updateLikeCount();
};

// 정렬 적용
const applySort = () => {
    renderCards(getView());
};

// 검색 이벤트
document.getElementById("q").addEventListener("input", (e) => {
    const keyword = e.target.value.trim().toLowerCase();

    const found = movies.filter(m =>
        m.title.toLowerCase().includes(keyword)
    );

    const key = document.getElementById("sort").value;

    renderCards(sortBy(found, key, key !== "title"));
});

// 정렬 이벤트
document.getElementById("sort").addEventListener("change", applySort);

// 좋아요 버튼 이벤트
document.querySelector(".board").addEventListener("click", function(e) {

    // this와 e.target 확인
    console.log("this:", this, "e.target:", e.target);

    const button = e.target.closest(".like");

    if (!button) {
        return;
    }

    // 좋아요 상태 변경
    button.classList.toggle("liked");

    // 좋아요 개수 업데이트
    updateLikeCount();
});

// Escape 키로 검색 초기화
document.getElementById("q").addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        e.target.value = "";
        renderCards(getView());
    }
});

// 처음 화면 표시
applySort();