// ==========================
// Study OS v2
// Part 1
// Core System
// ==========================


// --------------------------
// 날짜 & 시간
// --------------------------

function updateDateTime() {

    const now = new Date();

    const dateElement =
        document.getElementById(
            "currentDate"
        );

    const timeElement =
        document.getElementById(
            "currentTime"
        );

    if (dateElement) {

        dateElement.textContent =
            now.toLocaleDateString(
                "ko-KR",
                {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    weekday: "long"
                }
            );

    }

    if (timeElement) {

        timeElement.textContent =
            now.toLocaleTimeString(
                "ko-KR"
            );

    }

}

updateDateTime();

setInterval(
    updateDateTime,
    1000
);


// --------------------------
// 목표 시스템
// --------------------------

function saveGoal() {

    const input =
        document.getElementById(
            "goalInput"
        );

    if (!input) return;

    const goal =
        input.value.trim();

    if (goal === "") return;

    localStorage.setItem(
        "studyos_goal",
        goal
    );

    loadGoal();

    input.value = "";

}

function loadGoal() {

    const goal =
        localStorage.getItem(
            "studyos_goal"
        );

    const display =
        document.getElementById(
            "goalDisplay"
        );

    if (!display) return;

    if (goal) {

        display.textContent =
            "🎯 " + goal;

    } else {

        display.textContent =
            "아직 목표가 없습니다.";

    }

}

loadGoal();


// --------------------------
// AI 브리핑
// --------------------------

function generateBriefing() {

    const briefing =
        document.getElementById(
            "aiBriefing"
        );

    if (!briefing) return;

    briefing.textContent =
        "Study OS가 학습 데이터를 분석할 준비가 되었습니다.";

}

generateBriefing();


// --------------------------
// 대시보드
// --------------------------

function updateDashboard() {

    const total =
        document.getElementById(
            "totalHomework"
        );

    const completed =
        document.getElementById(
            "completedHomework"
        );

    const remaining =
        document.getElementById(
            "remainingHomework"
        );

    if (total) {
        total.textContent = "0";
    }

    if (completed) {
        completed.textContent = "0";
    }

    if (remaining) {
        remaining.textContent = "0";
    }

}

updateDashboard();


// ==========================
// End of Part 1
// ==========================
// ==========================
// Study OS v2
// Part 2
// Homework System
// ==========================

const homeworkList =
    document.getElementById(
        "homeworkList"
    );

function addHomework() {

    const input =
        document.getElementById(
            "homeworkInput"
        );

    const subject =
        document.getElementById(
            "subjectSelect"
        );

    if (
        !input ||
        input.value.trim() === ""
    ) {
        return;
    }

    const homework = {

        subject: subject.value,

        text:
            input.value.trim(),

        completed: false

    };

    createHomeworkItem(
        homework
    );

    saveHomework();

    updateHomeworkStats();

    input.value = "";

}

function createHomeworkItem(
    homework
) {

    const li =
        document.createElement(
            "li"
        );

    const checkbox =
        document.createElement(
            "input"
        );

    checkbox.type =
        "checkbox";

    checkbox.checked =
        homework.completed;

    const text =
        document.createElement(
            "span"
        );

    text.textContent =
        `[${homework.subject}] ${homework.text}`;

    const deleteButton =
        document.createElement(
            "button"
        );

    deleteButton.textContent =
        "삭제";

    checkbox.addEventListener(
        "change",
        () => {

            saveHomework();

            updateHomeworkStats();

            generateBriefing();

        }
    );

    deleteButton.onclick =
        function () {

            li.remove();

            saveHomework();

            updateHomeworkStats();

            generateBriefing();

        };

    li.appendChild(
        checkbox
    );

    li.appendChild(
        text
    );

    li.appendChild(
        deleteButton
    );

    homeworkList.appendChild(
        li
    );

}

function saveHomework() {

    const items = [];

    document
        .querySelectorAll(
            "#homeworkList li"
        )
        .forEach(li => {

            const checkbox =
                li.querySelector(
                    "input"
                );

            const text =
                li.querySelector(
                    "span"
                );

            items.push({

                text:
                    text.textContent,

                completed:
                    checkbox.checked

            });

        });

    localStorage.setItem(
        "studyos_homework",
        JSON.stringify(
            items
        )
    );

}

function loadHomework() {

    const saved =
        JSON.parse(

            localStorage.getItem(
                "studyos_homework"
            )

        ) || [];

    saved.forEach(item => {

        const rawText =
            item.text;

        let subject =
            "기타";

        let homeworkText =
            rawText;

        if (
            rawText.startsWith("[")
        ) {

            const end =
                rawText.indexOf(
                    "]"
                );

            subject =
                rawText.substring(
                    1,
                    end
                );

            homeworkText =
                rawText.substring(
                    end + 2
                );

        }

        createHomeworkItem({

            subject:
                subject,

            text:
                homeworkText,

            completed:
                item.completed

        });

    });

}

function updateHomeworkStats() {

    const all =
        document
            .querySelectorAll(
                "#homeworkList li"
            )
            .length;

    const completed =
        document
            .querySelectorAll(
                "#homeworkList input:checked"
            )
            .length;

    const remaining =
        all - completed;

    const totalElement =
        document.getElementById(
            "totalHomework"
        );

    const completedElement =
        document.getElementById(
            "completedHomework"
        );

    const remainingElement =
        document.getElementById(
            "remainingHomework"
        );

    if (totalElement) {

        totalElement.textContent =
            all;

    }

    if (completedElement) {

        completedElement.textContent =
            completed;

    }

    if (remainingElement) {

        remainingElement.textContent =
            remaining;

    }

}

loadHomework();

updateHomeworkStats();

generateBriefing();


// ==========================
// End of Part 2
// ==========================
// ==========================
// Study OS v2
// Part 3
// Exam System
// ==========================

const examList =
    document.getElementById(
        "examList"
    );

const upcomingExamList =
    document.getElementById(
        "upcomingExamList"
    );

function addExam() {

    const name =
        document.getElementById(
            "examName"
        );

    const date =
        document.getElementById(
            "examDate"
        );

    if (
        !name ||
        !date ||
        name.value.trim() === "" ||
        date.value === ""
    ) {
        return;
    }

  const subject =
    document.getElementById(
        "examSubject"
    );

const exam = {

    subject:
        subject.value,

    name:
        name.value.trim(),

    date:
        date.value

};

    createExamItem(
        exam
    );

    saveExam();

    updateUpcomingExams();

    generateBriefing();

    name.value = "";
    date.value = "";

}

function createExamItem(
    exam
) {

    const li =
        document.createElement(
            "li"
        );

    const deleteButton =
        document.createElement(
            "button"
        );

    deleteButton.textContent =
        "삭제";

    const dday =
        calculateDday(
            exam.date
        );

    const text =
        document.createElement(
            "span"
        );
text.textContent =
    `${exam.subject} | ${exam.name} | ${exam.date} | D-${dday}`;

    deleteButton.onclick =
        function () {

            li.remove();

            saveExam();

            updateUpcomingExams();

            generateBriefing();

        };

    li.appendChild(
        text
    );

    li.appendChild(
        deleteButton
    );

    examList.appendChild(
        li
    );

}

function calculateDday(
    targetDate
) {

    const today =
        new Date();

    const examDate =
        new Date(
            targetDate
        );

    const diffTime =
        examDate - today;

    const diffDays =
        Math.ceil(
            diffTime /
            (
                1000 *
                60 *
                60 *
                24
            )
        );

    return diffDays;

}

function saveExam() {

    const exams = [];

    document
        .querySelectorAll(
            "#examList li span"
        )
        .forEach(item => {

            exams.push(
                item.textContent
            );

        });

    localStorage.setItem(
        "studyos_exams",
        JSON.stringify(
            exams
        )
    );

}

function loadExam() {

    const exams =
        JSON.parse(

            localStorage.getItem(
                "studyos_exams"
            )

        ) || [];

    exams.forEach(text => {

        const li =
            document.createElement(
                "li"
            );

        const span =
            document.createElement(
                "span"
            );

        span.textContent =
            text;

        const deleteButton =
            document.createElement(
                "button"
            );

        deleteButton.textContent =
            "삭제";

        deleteButton.onclick =
            function () {

                li.remove();

                saveExam();

                updateUpcomingExams();

            };

        li.appendChild(
            span
        );

        li.appendChild(
            deleteButton
        );

        examList.appendChild(
            li
        );

    });

}

function updateUpcomingExams() {

    if (
        !upcomingExamList
    ) return;

    upcomingExamList.innerHTML =
        "";

    document
        .querySelectorAll(
            "#examList li span"
        )
        .forEach(item => {

            const li =
                document.createElement(
                    "li"
                );

            li.textContent =
                item.textContent;

            upcomingExamList.appendChild(
                li
            );

        });

}

loadExam();

updateUpcomingExams();


// ==========================
// AI 브리핑 업그레이드
// ==========================

function generateBriefing() {

    const briefing =
        document.getElementById(
            "aiBriefing"
        );

    if (!briefing) return;

    const homeworkCount =
        document.querySelectorAll(
            "#homeworkList li"
        ).length;

    const examCount =
        document.querySelectorAll(
            "#examList li"
        ).length;

    if (
        examCount > 0 &&
        homeworkCount > 0
    ) {

        briefing.textContent =
            `현재 등록된 시험 ${examCount}개, 숙제 ${homeworkCount}개가 있습니다. 가장 가까운 시험을 우선 준비하는 것을 추천합니다.`;

    } else if (
        examCount > 0
    ) {

        briefing.textContent =
            `시험 ${examCount}개가 등록되어 있습니다. 시험 준비를 우선 진행하세요.`;

    } else if (
        homeworkCount > 0
    ) {

        briefing.textContent =
            `숙제 ${homeworkCount}개가 등록되어 있습니다. 남은 숙제를 먼저 처리하는 것을 추천합니다.`;

    } else {

        briefing.textContent =
            "학습 데이터를 입력하면 AI 브리핑이 시작됩니다.";

    }

}

generateBriefing();


// ==========================
// End of Part 3
// ==========================
// ==========================
// Study OS v2
// Part 4
// Study Analytics
// ==========================


// --------------------------
// 공부시간 타이머
// --------------------------

let timerInterval;
let timerSeconds = 0;

function startTimer() {

    clearInterval(
        timerInterval
    );

    timerInterval =
        setInterval(() => {

            timerSeconds++;

            updateTimerDisplay();

        }, 1000);

}

function stopTimer() {

    clearInterval(
        timerInterval
    );

    saveStudyTime();

}

function updateTimerDisplay() {

    const display =
        document.getElementById(
            "timerDisplay"
        );

    if (!display) return;

    display.textContent =
        `${timerSeconds}초`;

}

function saveStudyTime() {

    const selectedSubject =
        document.getElementById(
            "timerSubject"
        );

    if (!selectedSubject) return;

    const subject =
        selectedSubject.value;

    const previousTime =
        Number(
            localStorage.getItem(
                "studyos_studytime"
            )
        ) || 0;

    localStorage.setItem(
        "studyos_studytime",
        previousTime + timerSeconds
    );

    let subjectData =
        JSON.parse(
            localStorage.getItem(
                "studyos_subject_time"
            )
        ) || {};

    if (!subjectData[subject]) {

        subjectData[subject] = 0;

    }

    subjectData[subject] += timerSeconds;

    localStorage.setItem(
        "studyos_subject_time",
        JSON.stringify(subjectData)
    );

    timerSeconds = 0;

    updateTimerDisplay();

    updateStudyStats();

    updateSubjectStats();

    generateBriefing();

}


// --------------------------
// 공부시간 통계
// --------------------------

function updateStudyStats() {

    const totalSeconds =
        Number(
            localStorage.getItem(
                "studyos_studytime"
            )
        ) || 0;

    const minutes =
        Math.floor(
            totalSeconds / 60
        );

    const todayElement =
        document.getElementById(
            "todayStudyTime"
        );

    if (
        todayElement
    ) {

        todayElement.textContent =
            `${minutes}분`;

    }

}

updateStudyStats();


// --------------------------
// 목표 시스템 업그레이드
// --------------------------

function saveGoal() {

    const input =
        document.getElementById(
            "goalInput"
        );

    if (!input) return;

    const goal =
        input.value.trim();

    if (
        goal === ""
    ) return;

    localStorage.setItem(
        "studyos_goal",
        goal
    );

    loadGoal();

    generateBriefing();

    input.value = "";

}

function loadGoal() {

    const goal =
        localStorage.getItem(
            "studyos_goal"
        );

    const display =
        document.getElementById(
            "goalDisplay"
        );

    if (!display) return;

    if (goal) {

        display.textContent =
            "🎯 " + goal;

    } else {

        display.textContent =
            "아직 목표가 없습니다.";

    }

}

loadGoal();


// --------------------------
// 과목 분석
// --------------------------

function updateSubjectStats() {

    const stats =
        document.getElementById(
            "subjectStats"
        );

    if (!stats) return;

    const data =
        JSON.parse(
            localStorage.getItem(
                "studyos_subject_time"
            )
        ) || {};

    let html = "";

    const subjects = [
        "국어",
        "수학",
        "영어",
        "사회"
    ];

    subjects.forEach(subject => {

   const totalSeconds =
    data[subject] || 0;

const minutes =
    Math.floor(
        totalSeconds / 60
    );

const seconds =
    totalSeconds % 60;

html += `
    <p>
    ${subject} :
    ${minutes}분 ${seconds}초
    </p>
`;

    });

    stats.innerHTML =
        html;

}


// --------------------------
// AI 브리핑 최종 업그레이드
// --------------------------

function generateBriefing() {

    const briefing =
        document.getElementById(
            "aiBriefing"
        );

    if (!briefing) return;

    const homeworkCount =
        document.querySelectorAll(
            "#homeworkList li"
        ).length;

    const examCount =
        document.querySelectorAll(
            "#examList li"
        ).length;

    const studyTime =
        Number(
            localStorage.getItem(
                "studyos_studytime"
            )
        ) || 0;

    const studyMinutes =
        Math.floor(
            studyTime / 60
        );

    let message =
        "";

    if (
        examCount > 0
    ) {

        message +=
            `시험 ${examCount}개가 등록되어 있습니다. `;

    }

    if (
        homeworkCount > 0
    ) {

        message +=
            `남은 숙제 ${homeworkCount}개가 있습니다. `;

    }

    if (
        studyMinutes < 30
    ) {

        message +=
            `오늘 공부시간이 부족합니다. 최소 30분 이상 공부를 추천합니다.`;

    } else {

        message +=
            `좋습니다. 현재까지 ${studyMinutes}분 공부했습니다.`;

    }

    briefing.textContent =
        message;

}

generateBriefing();


// --------------------------
// 자동 갱신
// --------------------------

setInterval(() => {

    updateStudyStats();

    updateSubjectStats();

}, 3000);


// ==========================
// End of Part 4
// ==========================
function pauseTimer() {

    clearInterval(
        timerInterval
    );

}
updateSubjectStats();
function hideAllPages() {

    document
        .querySelectorAll(".page")
        .forEach(page => {

            page.style.display =
                "none";

        });

}

function showDashboard() {

    hideAllPages();

    updateHeader("dashboard");

    document
        .querySelectorAll(
            ".dashboard-page"
        )
        .forEach(page => {

            page.style.display =
                "block";

        });

}

function showTasks() {

    hideAllPages();

    updateHeader("tasks");

    document
        .querySelectorAll(
            ".task-page"
        )
        .forEach(page => {

            page.style.display =
                "block";

        });

}

function showExams() {

    hideAllPages();

    updateHeader("exams");

    document
        .querySelectorAll(
            ".exam-page"
        )
        .forEach(page => {

            page.style.display =
                "block";

        });

}

function showStudy() {

    hideAllPages();

    updateHeader("study");

    document
        .querySelectorAll(
            ".study-page"
        )
        .forEach(page => {

            page.style.display =
                "block";

        });

}

function showAnalytics() {

    hideAllPages();

    updateHeader("analytics");

    document
        .querySelectorAll(
            ".analytics-page"
        )
        .forEach(page => {

            page.style.display =
                "block";

        });

}

showDashboard();
function updateHeader(page) {

    const header =
        document.querySelector(
            ".dashboard-header"
        );

    if (page === "dashboard") {

        header.style.display =
            "flex";

    } else {

        header.style.display =
            "none";

    }
}
function showCoach() {

    hideAllPages();

    updateHeader("coach");

    document
        .querySelectorAll(".coach-page")
        .forEach(page => {

            page.style.display =
                "block";

        });
        runAIAnalysis();

}
function runAIAnalysis() {

    const exams =
        JSON.parse(
            localStorage.getItem(
                "studyos_exams"
            )
        ) || [];

    const subjectTimes =
        JSON.parse(
            localStorage.getItem(
                "studyos_subject_time"
            )
        ) || {};

    let nearestExam = null;
    let nearestDays = 9999;

    exams.forEach(exam => {

        const examDate =
            new Date(exam.date);

        const today =
            new Date();

        const diffDays =
            Math.ceil(
                (examDate - today)
                /
                (1000 * 60 * 60 * 24)
            );

        if (
            diffDays >= 0 &&
            diffDays < nearestDays
        ) {

            nearestDays = diffDays;
            nearestExam = exam;

        }

    });

    let weakestSubject = "";
    let lowestTime = Infinity;

    Object.entries(subjectTimes)
        .forEach(([subject, time]) => {

            if (time < lowestTime) {

                lowestTime = time;
                weakestSubject = subject;

            }

        });

    let result = "";

    if (nearestExam) {

        result += `
        📅 가장 가까운 일정<br>
        ${nearestExam.subject}
        |
        ${nearestExam.name}
        |
        D-${nearestDays}
        <br><br>
        `;

    }

    if (weakestSubject) {

        result += `
        ⚠ 가장 부족한 과목<br>
        ${weakestSubject}
        <br><br>
        `;

    }

    result += `
    🎯 오늘 추천

    <br><br>

    1. ${weakestSubject}

    <br>

    2. 시험 과목 복습

    <br>

    3. 남은 할일 처리

    <br><br>

    추천 공부시간
    120분
    `;

    document.getElementById(
        "coachAnswer"
    ).innerHTML = result;

}
function showProfile() {

    hideAllPages();

    updateHeader("profile");

    document
        .querySelectorAll(".profile-page")
        .forEach(page => {

            page.style.display =
                "block";

        });

    loadProfile();

    loadSchedules();

}
function saveProfile() {

    const profile = {


        university:
            document.getElementById(
                "targetUniversity"
            ).value,

        major:
            document.getElementById(
                "targetMajor"
            ).value,

        currentGrade:
            document.getElementById(
                "currentGrade"
            ).value,

        targetGrade:
            document.getElementById(
                "targetGrade"
            ).value

    };

    localStorage.setItem(
        "studyos_profile",
        JSON.stringify(profile)
    );

    loadProfile();

}
function loadProfile() {

    const profile =
        JSON.parse(
            localStorage.getItem(
                "studyos_profile"
            )
        );

    if (!profile) return;

    document.getElementById(
        "profileSummary"
    ).innerHTML = `


        🏫 목표 대학:
        ${profile.university}

        <br><br>

        📚 목표 학과:
        ${profile.major}

        <br><br>

        📈 현재 등급:
        ${profile.currentGrade}

        <br><br>

        🎯 목표 등급:
        ${profile.targetGrade}

    `;

}
function addSchedule() {

    const day =
        document.getElementById(
            "scheduleDay"
        ).value;

    const start =
        document.getElementById(
            "scheduleStart"
        ).value;

    const end =
        document.getElementById(
            "scheduleEnd"
        ).value;

    const content =
        document.getElementById(
            "scheduleContent"
        ).value;

    if (content.trim() === "") {
        return;
    }

    const schedules =
        JSON.parse(
            localStorage.getItem(
                "studyos_schedule"
            )
        ) || [];

    schedules.push({
        day,
        start,
        end,
        content
    });

    localStorage.setItem(
        "studyos_schedule",
        JSON.stringify(schedules)
    );

    loadSchedules();

}
function loadSchedules() {

    const list =
        document.getElementById(
            "scheduleList"
        );

    if (!list) return;

    list.innerHTML = "";

    const schedules =
        JSON.parse(
            localStorage.getItem(
                "studyos_schedule"
            )
        ) || [];

    schedules.forEach(item => {

        const li =
            document.createElement("li");

        li.textContent =
            `${item.day} | ${item.start} ~ ${item.end} | ${item.content}`;

        list.appendChild(li);

    });

}