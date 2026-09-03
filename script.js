/* =========================
   DATA
========================= */

let bookmarks =
    JSON.parse(localStorage.getItem("bookmarks")) || [];

let collections =
    JSON.parse(localStorage.getItem("collections")) ||
    ["General"];

let currentView = "all";

let selectedCollection = null;


/* =========================
   SAVE DATA
========================= */

function saveData() {

    localStorage.setItem(
        "bookmarks",
        JSON.stringify(bookmarks)
    );

    localStorage.setItem(
        "collections",
        JSON.stringify(collections)
    );
}


/* =========================
   USER
========================= */

function loadUser() {

    const user =
        JSON.parse(localStorage.getItem("user"));

    const userName =
        document.getElementById("userName");

    const loginBtn =
        document.getElementById("loginBtn");

    if (!userName || !loginBtn) {
        return;
    }

    if (user) {

        userName.textContent =
            "Hi, " + user.name;

        loginBtn.textContent =
            "Logout";

    } else {

        userName.textContent = "";

        loginBtn.textContent =
            "Login";
    }
}


function loginAction() {

    const user =
        localStorage.getItem("user");

    if (user) {

        localStorage.removeItem("user");

        alert("Logged out successfully.");

        loadUser();

    } else {

        window.location.href =
            "login.html";
    }
}


/* =========================
   REGISTER
========================= */

const registerForm =
    document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                document
                    .getElementById("registerName")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("registerEmail")
                    .value
                    .trim()
                    .toLowerCase();


            const password =
                document
                    .getElementById("registerPassword")
                    .value;


            const users =
                JSON.parse(
                    localStorage.getItem("users")
                ) || [];


            const message =
                document.getElementById(
                    "registerMessage"
                );


            const exists =
                users.some(
                    user =>
                        user.email === email
                );


            if (exists) {

                message.textContent =
                    "Email already registered.";

                return;
            }


            users.push({
                name,
                email,
                password
            });


            localStorage.setItem(
                "users",
                JSON.stringify(users)
            );


            message.style.color =
                "#16a34a";

            message.textContent =
                "Account created successfully!";


            setTimeout(
                function () {

                    window.location.href =
                        "login.html";

                },
                1000
            );
        }
    );
}


/* =========================
   LOGIN
========================= */

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const email =
                document
                    .getElementById("loginEmail")
                    .value
                    .trim()
                    .toLowerCase();


            const password =
                document
                    .getElementById("loginPassword")
                    .value;


            const users =
                JSON.parse(
                    localStorage.getItem("users")
                ) || [];


            const message =
                document.getElementById(
                    "loginMessage"
                );


            const user =
                users.find(
                    item =>
                        item.email === email &&
                        item.password === password
                );


            if (!user) {

                message.style.color =
                    "#dc2626";

                message.textContent =
                    "Invalid email or password.";

                return;
            }


            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );


            window.location.href =
                "index.html";
        }
    );
}


/* =========================
   BOOKMARK MODAL
========================= */

function openBookmarkModal(id = null) {

    const modal =
        document.getElementById(
            "bookmarkModal"
        );


    const form =
        document.getElementById(
            "bookmarkForm"
        );


    form.reset();


    document.getElementById(
        "bookmarkId"
    ).value = "";


    document.getElementById(
        "bookmarkModalTitle"
    ).textContent =
        id
            ? "Edit Bookmark"
            : "Add Bookmark";


    renderCollectionOptions();


    if (id) {

        const bookmark =
            bookmarks.find(
                item =>
                    item.id === id
            );


        if (!bookmark) {
            return;
        }


        document.getElementById(
            "bookmarkId"
        ).value =
            bookmark.id;


        document.getElementById(
            "bookmarkTitle"
        ).value =
            bookmark.title;


        document.getElementById(
            "bookmarkUrl"
        ).value =
            bookmark.url;


        document.getElementById(
            "bookmarkDescription"
        ).value =
            bookmark.description;


        document.getElementById(
            "bookmarkType"
        ).value =
            bookmark.type;


        document.getElementById(
            "bookmarkCollection"
        ).value =
            bookmark.collection;
    }


    modal.classList.add("show");
}


function closeBookmarkModal() {

    document
        .getElementById("bookmarkModal")
        .classList.remove("show");
}


/* =========================
   ADD / EDIT BOOKMARK
========================= */

const bookmarkForm =
    document.getElementById(
        "bookmarkForm"
    );


if (bookmarkForm) {

    bookmarkForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const id =
                document.getElementById(
                    "bookmarkId"
                ).value;


            const data = {

                title:
                    document
                        .getElementById(
                            "bookmarkTitle"
                        )
                        .value
                        .trim(),

                url:
                    document
                        .getElementById(
                            "bookmarkUrl"
                        )
                        .value
                        .trim(),

                description:
                    document
                        .getElementById(
                            "bookmarkDescription"
                        )
                        .value
                        .trim(),

                type:
                    document
                        .getElementById(
                            "bookmarkType"
                        )
                        .value,

                collection:
                    document
                        .getElementById(
                            "bookmarkCollection"
                        )
                        .value
            };


            if (id) {

                const bookmark =
                    bookmarks.find(
                        item =>
                            item.id === id
                    );


                if (bookmark) {

                    Object.assign(
                        bookmark,
                        data
                    );
                }

            } else {

                bookmarks.push({

                    id:
                        Date.now().toString(),

                    ...data,

                    favorite: false,

                    readLater: false,

                    createdAt:
                        new Date().toISOString()
                });
            }


            saveData();

            closeBookmarkModal();

            renderBookmarks();

            renderCollections();
        }
    );
}


/* =========================
   DELETE BOOKMARK
========================= */

function deleteBookmark(id) {

    const confirmed =
        confirm(
            "Delete this bookmark?"
        );


    if (!confirmed) {
        return;
    }


    bookmarks =
        bookmarks.filter(
            item =>
                item.id !== id
        );


    saveData();

    renderBookmarks();
}


/* =========================
   FAVORITE
========================= */

function toggleFavorite(id) {

    const bookmark =
        bookmarks.find(
            item =>
                item.id === id
        );


    if (!bookmark) {
        return;
    }


    bookmark.favorite =
        !bookmark.favorite;


    saveData();

    renderBookmarks();
}


/* =========================
   READ LATER
========================= */

function toggleReadLater(id) {

    const bookmark =
        bookmarks.find(
            item =>
                item.id === id
        );


    if (!bookmark) {
        return;
    }


    bookmark.readLater =
        !bookmark.readLater;


    saveData();

    renderBookmarks();
}


/* =========================
   VIEWS
========================= */

function showAll() {

    currentView = "all";

    selectedCollection = null;

    renderBookmarks();
}


function showFavorites() {

    currentView = "favorites";

    selectedCollection = null;

    renderBookmarks();
}


function showReadLater() {

    currentView = "readLater";

    selectedCollection = null;

    renderBookmarks();
}


function showCollection(name) {

    currentView = "collection";

    selectedCollection = name;

    renderBookmarks();
}


/* =========================
   RENDER BOOKMARKS
========================= */

function renderBookmarks() {

    const container =
        document.getElementById(
            "bookmarkContainer"
        );


    const empty =
        document.getElementById(
            "emptyState"
        );


    if (!container) {
        return;
    }


    let result =
        [...bookmarks];


    const search =
        document
            .getElementById("search")
            ?.value
            .toLowerCase() || "";


    const type =
        document
            .getElementById("typeFilter")
            ?.value || "all";


    const sort =
        document
            .getElementById("sort")
            ?.value || "newest";


    /* VIEW FILTER */

    if (currentView === "favorites") {

        result =
            result.filter(
                item =>
                    item.favorite
            );
    }


    if (currentView === "readLater") {

        result =
            result.filter(
                item =>
                    item.readLater
            );
    }


    if (currentView === "collection") {

        result =
            result.filter(
                item =>
                    item.collection ===
                    selectedCollection
            );
    }


    /* SEARCH */

    if (search) {

        result =
            result.filter(item =>

                item.title
                    .toLowerCase()
                    .includes(search)

                ||

                item.description
                    .toLowerCase()
                    .includes(search)

                ||

                item.url
                    .toLowerCase()
                    .includes(search)
            );
    }


    /* TYPE */

    if (type !== "all") {

        result =
            result.filter(
                item =>
                    item.type === type
            );
    }


    /* SORT */

    if (sort === "newest") {

        result.sort(
            (a, b) =>
                new Date(b.createdAt) -
                new Date(a.createdAt)
        );

    } else if (sort === "oldest") {

        result.sort(
            (a, b) =>
                new Date(a.createdAt) -
                new Date(b.createdAt)
        );

    } else if (sort === "az") {

        result.sort(
            (a, b) =>
                a.title.localeCompare(
                    b.title
                )
        );
    }


    container.innerHTML = "";


    if (result.length === 0) {

        empty.style.display =
            "block";

        return;
    }


    empty.style.display =
        "none";


    result.forEach(
        bookmark => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "bookmark-card";


            card.innerHTML = `

                <div class="card-top">

                    <div>

                        <h3>
                            ${escapeHTML(
                                bookmark.title
                            )}
                        </h3>

                        <a
                            class="bookmark-url"
                            href="${escapeHTML(
                                bookmark.url
                            )}"
                            target="_blank">

                            ${escapeHTML(
                                bookmark.url
                            )}

                        </a>

                    </div>


                    <span class="badge">
                        ${escapeHTML(
                            bookmark.type
                        )}
                    </span>

                </div>


                <p class="bookmark-description">

                    ${escapeHTML(
                        bookmark.description ||
                        "No description"
                    )}

                </p>


                <small>
                    📁
                    ${escapeHTML(
                        bookmark.collection
                    )}
                </small>


                <div class="card-actions">

                    <button
                        onclick="toggleFavorite('${bookmark.id}')">

                        ${
                            bookmark.favorite
                                ? "⭐"
                                : "☆"
                        }

                    </button>


                    <button
                        onclick="toggleReadLater('${bookmark.id}')">

                        ${
                            bookmark.readLater
                                ? "📖"
                                : "📕"
                        }

                    </button>


                    <button
                        onclick="openBookmarkModal('${bookmark.id}')">

                        ✏️

                    </button>


                    <button
                        onclick="deleteBookmark('${bookmark.id}')">

                        🗑️

                    </button>

                </div>
            `;


            container.appendChild(card);
        }
    );
}


/* =========================
   COLLECTIONS
========================= */

function renderCollections() {

    const list =
        document.getElementById(
            "collectionList"
        );


    if (!list) {
        return;
    }


    list.innerHTML = "";


    collections.forEach(
        name => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "collection-item";


            const nameSpan =
                document.createElement(
                    "span"
                );


            nameSpan.className =
                "collection-name";


            nameSpan.textContent =
                "📁 " + name;


            nameSpan.onclick =
                function () {

                    showCollection(
                        name
                    );
                };


            item.appendChild(
                nameSpan
            );


            if (name !== "General") {

                const menu =
                    document.createElement(
                        "div"
                    );


                menu.className =
                    "collection-menu";


                menu.innerHTML = `

                    <button
                        onclick="toggleCollectionMenu(event)">

                        ⋮

                    </button>

                    <div class="collection-dropdown">

                        <button
                            onclick="editCollection('${escapeAttribute(name)}')">

                            ✏️ Edit

                        </button>

                        <button
                            onclick="deleteCollection('${escapeAttribute(name)}')">

                            🗑️ Delete

                        </button>

                    </div>
                `;


                item.appendChild(
                    menu
                );
            }


            list.appendChild(
                item
            );
        }
    );


    renderCollectionOptions();
}


/* =========================
   COLLECTION OPTIONS
========================= */

function renderCollectionOptions() {

    const select =
        document.getElementById(
            "bookmarkCollection"
        );


    if (!select) {
        return;
    }


    select.innerHTML = "";


    collections.forEach(
        name => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                name;


            option.textContent =
                name;


            select.appendChild(
                option
            );
        }
    );
}


/* =========================
   COLLECTION MODAL
========================= */

function openCollectionModal(
    oldName = null
) {

    const modal =
        document.getElementById(
            "collectionModal"
        );


    document.getElementById(
        "collectionModalTitle"
    ).textContent =
        oldName
            ? "Edit Collection"
            : "New Collection";


    document.getElementById(
        "oldCollection"
    ).value =
        oldName || "";


    document.getElementById(
        "collectionName"
    ).value =
        oldName || "";


    modal.classList.add(
        "show"
    );
}


function closeCollectionModal() {

    document
        .getElementById(
            "collectionModal"
        )
        .classList.remove(
            "show"
        );
}


/* =========================
   EDIT COLLECTION
========================= */

function editCollection(name) {

    openCollectionModal(
        name
    );
}


/* =========================
   DELETE COLLECTION
========================= */

function deleteCollection(name) {

    const confirmed =
        confirm(
            `Delete "${name}" collection?\n\nBookmarks will move to General.`
        );


    if (!confirmed) {
        return;
    }


    bookmarks.forEach(
        bookmark => {

            if (
                bookmark.collection ===
                name
            ) {

                bookmark.collection =
                    "General";
            }
        }
    );


    collections =
        collections.filter(
            item =>
                item !== name
        );


    if (
        selectedCollection ===
        name
    ) {

        selectedCollection =
            null;

        currentView =
            "all";
    }


    saveData();

    renderCollections();

    renderBookmarks();
}


/* =========================
   COLLECTION FORM
========================= */

const collectionForm =
    document.getElementById(
        "collectionForm"
    );


if (collectionForm) {

    collectionForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const newName =
                document
                    .getElementById(
                        "collectionName"
                    )
                    .value
                    .trim();


            const oldName =
                document
                    .getElementById(
                        "oldCollection"
                    )
                    .value;


            if (!newName) {
                return;
            }


            if (
                collections.includes(
                    newName
                ) &&
                newName !== oldName
            ) {

                alert(
                    "Collection already exists."
                );

                return;
            }


            if (oldName) {

                const index =
                    collections.indexOf(
                        oldName
                    );


                if (index !== -1) {

                    collections[index] =
                        newName;
                }


                bookmarks.forEach(
                    bookmark => {

                        if (
                            bookmark.collection ===
                            oldName
                        ) {

                            bookmark.collection =
                                newName;
                        }
                    }
                );


                if (
                    selectedCollection ===
                    oldName
                ) {

                    selectedCollection =
                        newName;
                }

            } else {

                collections.push(
                    newName
                );
            }


            saveData();

            closeCollectionModal();

            renderCollections();

            renderBookmarks();
        }
    );
}


/* =========================
   COLLECTION MENU
========================= */

function toggleCollectionMenu(
    event
) {

    event.stopPropagation();


    const dropdown =
        event.currentTarget
            .nextElementSibling;


    document
        .querySelectorAll(
            ".collection-dropdown"
        )
        .forEach(
            menu => {

                if (
                    menu !== dropdown
                ) {

                    menu.classList.remove(
                        "show"
                    );
                }
            }
        );


    dropdown.classList.toggle(
        "show"
    );
}


document.addEventListener(
    "click",
    function () {

        document
            .querySelectorAll(
                ".collection-dropdown"
            )
            .forEach(
                menu => {

                    menu.classList.remove(
                        "show"
                    );
                }
            );
    }
);


/* =========================
   DARK MODE
========================= */

function toggleDarkMode() {

    document.body.classList.toggle(
        "dark"
    );


    localStorage.setItem(
        "darkMode",
        document.body.classList.contains(
            "dark"
        )
    );
}


/* =========================
   HTML ESCAPE
========================= */

function escapeHTML(value) {

    return String(value)
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );
}


function escapeAttribute(value) {

    return String(value)
        .replaceAll(
            "\\",
            "\\\\"
        )
        .replaceAll(
            "'",
            "\\'"
        );
}


/* =========================
   START APP
========================= */

loadUser();


if (
    localStorage.getItem(
        "darkMode"
    ) === "true"
) {

    document.body.classList.add(
        "dark"
    );
}


renderCollections();

renderBookmarks();