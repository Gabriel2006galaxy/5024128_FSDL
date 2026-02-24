let students = [];

const form = document.getElementById("studentForm");
const table = document.getElementById("studentTable");

// =====================
// SAVE STUDENT
// =====================
form.addEventListener("submit", function(e) {

    e.preventDefault();

    const studentId = document.getElementById("studentId").value;
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;

    const sub1 = document.getElementById("sub1").value;
    const mark1 = document.getElementById("mark1").value;

    const sub2 = document.getElementById("sub2").value;
    const mark2 = document.getElementById("mark2").value;

    const sub3 = document.getElementById("sub3").value;
    const mark3 = document.getElementById("mark3").value;

    let subjects = [];

    if (sub1 && mark1) {
        subjects.push({ name: sub1, marks: Number(mark1) });
    }

    if (sub2 && mark2) {
        subjects.push({ name: sub2, marks: Number(mark2) });
    }

    if (sub3 && mark3) {
        subjects.push({ name: sub3, marks: Number(mark3) });
    }

    let total = 0;
    subjects.forEach(s => total += s.marks);

    let percentage = subjects.length === 0
        ? 0
        : (total / subjects.length).toFixed(2);

    const student = {
        id: studentId,
        name: name,
        phone: phone,
        email: email,
        subjects: subjects,
        percentage: percentage
    };

    students.push(student);

    renderStudents();
    form.reset();
});

// =====================
// RENDER STUDENTS
// =====================
function renderStudents(filter = "") {

    table.innerHTML = "";

    students
        .filter(s =>
            s.id.toLowerCase().includes(filter.toLowerCase()) ||
            s.name.toLowerCase().includes(filter.toLowerCase())
        )
        .forEach((s, index) => {

            const subjectText = s.subjects.length > 0
                ? s.subjects.map(sub => `${sub.name} (${sub.marks})`).join(", ")
                : "No Subjects";

            table.innerHTML += `
                <tr>
                    <td>${s.id}</td>
                    <td>${s.name}</td>
                    <td>${subjectText}</td>
                    <td>${s.percentage}%</td>
                    <td>
                        <button class="delete-btn"
                            onclick="deleteStudent(${index})">
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        });
}

// =====================
// DELETE
// =====================
function deleteStudent(index) {
    students.splice(index, 1);
    renderStudents();
}

// =====================
// SEARCH
// =====================
document.getElementById("searchBtn")
.addEventListener("click", function() {
    const value = document.getElementById("searchInput").value.trim();
    renderStudents(value);
});

// =====================
// CLEAR SEARCH
// =====================
document.getElementById("clearBtn")
.addEventListener("click", function() {
    document.getElementById("searchInput").value = "";
    renderStudents();
});