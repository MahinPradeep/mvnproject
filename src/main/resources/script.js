const studentForm = document.getElementById("student-form");
const studentTableBody = document.getElementById("student-table-body");
const searchInput = document.getElementById("search");
const formTitle = document.getElementById("form-title");
const submitButton = document.getElementById("submit-btn");
const cancelButton = document.getElementById("cancel-btn");
const emptyMessage = document.getElementById("empty-message");

const STORAGE_KEY = "students";
let students = loadStudents();
let editingId = null;

function loadStudents() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveStudents() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

function generateId() {
    return Date.now().toString();
}

function renderStudents() {
    const searchTerm = searchInput.value.toLowerCase().trim();

    const filteredStudents = students.filter(student => {
        return (
            student.name.toLowerCase().includes(searchTerm) ||
            student.roll.toLowerCase().includes(searchTerm) ||
            student.course.toLowerCase().includes(searchTerm)
        );
    });

    studentTableBody.innerHTML = "";

    if (filteredStudents.length === 0) {
        emptyMessage.style.display = "block";
        return;
    }

    emptyMessage.style.display = "none";

    filteredStudents.forEach((student, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
      <td>${index + 1}</td>
      <td>${escapeHtml(student.name)}</td>
      <td>${escapeHtml(student.email)}</td>
      <td>${escapeHtml(student.roll)}</td>
      <td>${escapeHtml(student.course)}</td>
      <td>${escapeHtml(student.phone)}</td>
      <td>${escapeHtml(student.grade)}</td>
      <td>
        <button class="action-btn edit-btn" data-id="${student.id}">
          Edit
        </button>
        <button class="action-btn delete-btn" data-id="${student.id}">
          Delete
        </button>
      </td>
    `;

        studentTableBody.appendChild(row);
    });
}

function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = value;
    return div.innerHTML;
}

function resetForm() {
    studentForm.reset();
    document.getElementById("student-id").value = "";
    editingId = null;
    formTitle.textContent = "Add Student";
    submitButton.textContent = "Save Student";
}

studentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const student = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        roll: document.getElementById("roll").value.trim(),
        course: document.getElementById("course").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        grade: document.getElementById("grade").value
    };

    if (editingId) {
        const index = students.findIndex(item => item.id === editingId);

        if (index !== -1) {
            students[index] = { id: editingId, ...student };
        }
    } else {
        students.push({ id: generateId(), ...student });
    }

    saveStudents();
    renderStudents();
    resetForm();
});

studentTableBody.addEventListener("click", function (event) {
    const button = event.target.closest("button");

    if (!button) return;

    const id = button.dataset.id;

    if (button.classList.contains("edit-btn")) {
        const student = students.find(item => item.id === id);

        if (!student) return;

        editingId = student.id;

        document.getElementById("student-id").value = student.id;
        document.getElementById("name").value = student.name;
        document.getElementById("email").value = student.email;
        document.getElementById("roll").value = student.roll;
        document.getElementById("course").value = student.course;
        document.getElementById("phone").value = student.phone;
        document.getElementById("grade").value = student.grade;

        formTitle.textContent = "Edit Student";
        submitButton.textContent = "Update Student";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    if (button.classList.contains("delete-btn")) {
        const confirmed = confirm("Are you sure you want to delete this student?");

        if (!confirmed) return;

        students = students.filter(item => item.id !== id);
        saveStudents();
        renderStudents();

        if (editingId === id) {
            resetForm();
        }
    }
});

searchInput.addEventListener("input", renderStudents);

cancelButton.addEventListener("click", resetForm);

renderStudents();