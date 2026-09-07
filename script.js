/* =========================
   LOGIN PROTECTION
========================= */

const currentPage = window.location.pathname.split("/").pop();

if (
    (currentPage === "" || currentPage === "index.html") &&
    !localStorage.getItem("token")
) {
    window.location.href = "login.html";
}


/* =========================
   APP DATA
========================= */

let bookmarks = [];

let collections = ["General"];

let collectionsData = [];

let currentView = "all";

let selectedCollection = null;

/* =========================
   USER / AUTH
========================= */

function loadUser() {
    const user = JSON.parse(localStorage.getItem("user"));
    const userName = document.getElementById("userName");
    const loginBtn = document.getElementById("loginBtn");

    if (!userName || !loginBtn) {
        return;
    }

    if (user) {
        userName.textContent = "Hi, " + user.name;
        loginBtn.textContent = "Logout";
    } else {
        userName.textContent = "";
        loginBtn.textContent = "Login";
    }
}


function loginAction() {
    const token = localStorage.getItem("token");

    if (token) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        alert("Logged out successfully.");

        window.location.href = "login.html";
    } else {
        window.location.href = "login.html";
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
        async function (event) {

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

            const message =
                document.getElementById("registerMessage");

            try {
                const response =
                    await fetch("/api/auth/register", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            name,
                            email,
                            password
                        })
                    });

                const data = await response.json();

                if (!response.ok) {
                    message.style.color = "#dc2626";
                    message.textContent =
                        data.message || "Registration failed.";
                    return;
                }

                localStorage.setItem(
                    "token",
                    data.token
                );

                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );

                message.style.color = "#16a34a";
                message.textContent =
                    "Account created successfully!";

                setTimeout(function () {
                    window.location.href =
                        "index.html";
                }, 700);

            } catch (error) {
                message.style.color = "#dc2626";
                message.textContent =
                    "Could not connect to server.";
            }
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
        async function (event) {

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

            const message =
                document.getElementById("loginMessage");

            try {
                const response =
                    await fetch("/api/auth/login", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            email,
                            password
                        })
                    });

                const data = await response.json();

                if (!response.ok) {
                    message.style.color = "#dc2626";
                    message.textContent =
                        data.message || "Invalid email or password.";
                    return;
                }

                localStorage.setItem(
                    "token",
                    data.token
                );

                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );

                window.location.href =
                    "index.html";

            } catch (error) {
                message.style.color = "#dc2626";
                message.textContent =
                    "Could not connect to server.";
            }
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
        async function (event) {

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


            const token =
                localStorage.getItem("token");


            if (!token) {

                alert("Please login first.");

                window.location.href =
                    "login.html";

                return;
            }


            try {

                let response;


                /* EDIT BOOKMARK */

                if (id) {

                    response =
                        await fetch(
                            `/api/bookmarks/${id}`,
                            {
                                method: "PUT",

                                headers: {
                                    "Content-Type":
                                        "application/json",

                                    "Authorization":
                                        `Bearer ${token}`
                                },

                                body:
                                    JSON.stringify(data)
                            }
                        );


                }

                /* ADD BOOKMARK */

                else {

                    response =
                        await fetch(
                            "/api/bookmarks",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json",

                                    "Authorization":
                                        `Bearer ${token}`
                                },

                                body:
                                    JSON.stringify(data)
                            }
                        );
                }


                const result =
                    await response.json();


                if (!response.ok) {

                    alert(
                        result.message ||
                        "Could not save bookmark."
                    );

                    return;
                }


                /* UPDATE FRONTEND ARRAY */

                if (id) {

                    const index =
                        bookmarks.findIndex(
                            item =>
                                item.id === id ||
                                item._id === id
                        );


                    if (index !== -1) {

                        bookmarks[index] = {
                            ...result,
                            id: result._id
                        };
                    }

                } else {

                    bookmarks.unshift({
                        ...result,
                        id: result._id
                    });
                }


                closeBookmarkModal();

                renderBookmarks();

                renderCollections();


            } catch (error) {

                console.log(error);

                alert(
                    "Could not connect to server."
                );
            }
        }
    );
}


/* =========================
   DELETE BOOKMARK
========================= */

async function deleteBookmark(id) {

    const confirmed =
        confirm(
            "Delete this bookmark?"
        );


    if (!confirmed) {
        return;
    }


    const token =
        localStorage.getItem("token");


    if (!token) {

        alert("Please login first.");

        window.location.href =
            "login.html";

        return;
    }


    try {

        const response =
            await fetch(
                `/api/bookmarks/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            alert(
                result.message ||
                "Could not delete bookmark."
            );

            return;
        }


        bookmarks =
            bookmarks.filter(
                item =>
                    item.id !== id &&
                    item._id !== id
            );


        renderBookmarks();

        renderCollections();


    } catch (error) {

        console.log(error);

        alert(
            "Could not connect to server."
        );
    }
}
/* =========================
   FAVORITE
========================= */

async function toggleFavorite(id) {

    const token =
        localStorage.getItem("token");


    if (!token) {

        alert("Please login first.");

        window.location.href =
            "login.html";

        return;
    }


    const bookmark =
        bookmarks.find(
            item =>
                item.id === id ||
                item._id === id
        );


    if (!bookmark) {
        return;
    }


    try {

        const response =
            await fetch(
                `/api/bookmarks/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        favorite:
                            !bookmark.favorite
                    })
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            alert(
                result.message ||
                "Could not update favorite."
            );

            return;
        }


        const index =
            bookmarks.findIndex(
                item =>
                    item.id === id ||
                    item._id === id
            );


        if (index !== -1) {

            bookmarks[index] = {
                ...result,
                id: result._id
            };
        }


        renderBookmarks();


    } catch (error) {

        console.log(error);

        alert(
            "Could not connect to server."
        );
    }
}

/* =========================
   READ LATER
========================= */

async function toggleReadLater(id) {

    const token =
        localStorage.getItem("token");


    if (!token) {

        alert("Please login first.");

        window.location.href =
            "login.html";

        return;
    }


    const bookmark =
        bookmarks.find(
            item =>
                item.id === id ||
                item._id === id
        );


    if (!bookmark) {
        return;
    }


    try {

        const response =
            await fetch(
                `/api/bookmarks/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        readLater:
                            !bookmark.readLater
                    })
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            alert(
                result.message ||
                "Could not update Read Later."
            );

            return;
        }


        const index =
            bookmarks.findIndex(
                item =>
                    item.id === id ||
                    item._id === id
            );


        if (index !== -1) {

            bookmarks[index] = {
                ...result,
                id: result._id
            };
        }


        renderBookmarks();


    } catch (error) {

        console.log(error);

        alert(
            "Could not connect to server."
        );
    }
}


/* =========================
   VIEWS
========================= */

function setActiveNav(activeButton) {

    document
        .querySelectorAll(".nav-item")
        .forEach(button => {
            button.classList.remove("active");
        });

    if (activeButton) {
        activeButton.classList.add("active");
    }
}


function showAll() {

    currentView = "all";

    selectedCollection = null;

    setActiveNav(
        document.querySelector(
            '.nav-item[onclick="showAll()"]'
        )
    );

    renderBookmarks();
}


function showFavorites() {

    currentView = "favorites";

    selectedCollection = null;

    setActiveNav(
        document.querySelector(
            '.nav-item[onclick="showFavorites()"]'
        )
    );

    renderBookmarks();
}


function showReadLater() {

    currentView = "readLater";

    selectedCollection = null;

    setActiveNav(
        document.querySelector(
            '.nav-item[onclick="showReadLater()"]'
        )
    );

    renderBookmarks();
}


function showCollection(name) {

    currentView = "collection";

    selectedCollection = name;

    document
        .querySelectorAll(".nav-item")
        .forEach(button => {
            button.classList.remove("active");
        });

    document
        .querySelectorAll(".collection-item")
        .forEach(item => {
            item.classList.remove("active");
        });

    const collections = document.querySelectorAll(".collection-item");

    collections.forEach(item => {

        const collectionName =
            item.querySelector(".collection-name");

        if (
            collectionName &&
           collectionName.textContent.trim().replace("📁 ", "") === name
        ) {
            item.classList.add("active");
        }
    });

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

async function editCollection(name) {

    const collection =
        collectionsData.find(
            item =>
                item.name === name
        );

    if (!collection) {

        alert(
            "Collection not found."
        );

        return;
    }


    const newName =
        prompt(
            "Enter new collection name:",
            name
        );


    if (newName === null) {
        return;
    }


    const trimmedName =
        newName.trim();


    if (!trimmedName) {

        alert(
            "Collection name cannot be empty."
        );

        return;
    }


    if (trimmedName === name) {
        return;
    }


    if (
        collections.includes(
            trimmedName
        )
    ) {

        alert(
            "Collection already exists."
        );

        return;
    }


    const token =
        localStorage.getItem(
            "token"
        );


    if (!token) {

        alert(
            "Please login first."
        );

        window.location.href =
            "login.html";

        return;
    }


    try {

        const response =
            await fetch(
                `/api/collections/${collection._id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`
                    },

                    body:
                        JSON.stringify({
                            name:
                                trimmedName
                        })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Could not rename collection."
            );

            return;
        }


        collections =
            collections.map(
                item =>
                    item === name
                        ? data.name
                        : item
            );


        collectionsData =
            collectionsData.map(
                item =>
                    item._id ===
                    collection._id
                        ? data
                        : item
            );


        bookmarks =
            bookmarks.map(
                bookmark => {

                    if (
                        bookmark.collection ===
                        name
                    ) {

                        return {
                            ...bookmark,
                            collection:
                                data.name
                        };

                    }

                    return bookmark;
                }
            );


        if (
            selectedCollection ===
            name
        ) {

            selectedCollection =
                data.name;
        }


        renderCollections();

        renderBookmarks();


    } catch (error) {

        console.log(error);

        alert(
            "Could not connect to server."
        );
    }
}
/* =========================
   DELETE COLLECTION
========================= */

async function deleteCollection(name) {

    if (name === "General") {

        alert(
            "General collection cannot be deleted."
        );

        return;
    }


    const collection =
        collectionsData.find(
            item =>
                item.name === name
        );


    if (!collection) {

        alert(
            "Collection not found."
        );

        return;
    }


    const confirmed =
        confirm(
            `Delete "${name}" collection?\n\nBookmarks will move to General.`
        );


    if (!confirmed) {
        return;
    }


    const token =
        localStorage.getItem(
            "token"
        );


    if (!token) {

        alert(
            "Please login first."
        );

        window.location.href =
            "login.html";

        return;
    }


    try {

        const response =
            await fetch(
                `/api/collections/${collection._id}`,
                {
                    method: "DELETE",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Could not delete collection."
            );

            return;
        }


        collections =
            collections.filter(
                item =>
                    item !== name
            );


        collectionsData =
            collectionsData.filter(
                item =>
                    item._id !==
                    collection._id
            );


        bookmarks =
            bookmarks.map(
                bookmark => {

                    if (
                        bookmark.collection ===
                        name
                    ) {

                        return {
                            ...bookmark,
                            collection:
                                "General"
                        };

                    }

                    return bookmark;
                }
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


        renderCollections();

        renderBookmarks();



    } catch (error) {

        console.log(error);

        alert(
            "Could not connect to server."
        );
    }
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
        async function (event) {

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

                alert(
                    "Collection name cannot be empty."
                );

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


            const token =
                localStorage.getItem(
                    "token"
                );


            if (!token) {

                alert(
                    "Please login first."
                );

                window.location.href =
                    "login.html";

                return;
            }


            try {

                /* =========================
                   EDIT EXISTING COLLECTION
                ========================= */

                if (oldName) {

                    const collection =
                        collectionsData.find(
                            item =>
                                item.name ===
                                oldName
                        );


                    if (!collection) {

                        alert(
                            "Collection not found."
                        );

                        return;
                    }


                    const response =
                        await fetch(
                            `/api/collections/${collection._id}`,
                            {
                                method: "PUT",

                                headers: {
                                    "Content-Type":
                                        "application/json",

                                    "Authorization":
                                        `Bearer ${token}`
                                },

                                body:
                                    JSON.stringify({
                                        name:
                                            newName
                                    })
                            }
                        );


                    const data =
                        await response.json();


                    if (!response.ok) {

                        alert(
                            data.message ||
                            "Could not update collection."
                        );

                        return;
                    }


                    collections =
                        collections.map(
                            name =>
                                name === oldName
                                    ? data.name
                                    : name
                        );


                    collectionsData =
                        collectionsData.map(
                            item =>
                                item._id ===
                                collection._id
                                    ? data
                                    : item
                        );


                    bookmarks =
                        bookmarks.map(
                            bookmark =>
                                bookmark.collection ===
                                oldName
                                    ? {
                                        ...bookmark,
                                        collection:
                                            data.name
                                    }
                                    : bookmark
                        );


                    if (
                        selectedCollection ===
                        oldName
                    ) {

                        selectedCollection =
                            data.name;
                    }


                    alert(
                        "Collection renamed successfully."
                    );

                }


                /* =========================
                   CREATE NEW COLLECTION
                ========================= */

                else {

                    const response =
                        await fetch(
                            "/api/collections",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json",

                                    "Authorization":
                                        `Bearer ${token}`
                                },

                                body:
                                    JSON.stringify({
                                        name:
                                            newName
                                    })
                            }
                        );


                    const data =
                        await response.json();


                    if (!response.ok) {

                        alert(
                            data.message ||
                            "Could not create collection."
                        );

                        return;
                    }


                    collectionsData.push(
                        data
                    );


                    collections.push(
                        data.name
                    );

                }


                closeCollectionModal();

                renderCollections();

                renderBookmarks();


            } catch (error) {

                console.log(error);

                alert(
                    "Could not connect to server."
                );
            }
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


/* =========================
   LOAD DATA FROM BACKEND
========================= */

async function loadBookmarksFromAPI() {

    const token =
        localStorage.getItem(
            "token"
        );

    if (!token) {
        return;
    }

    try {

        const response =
            await fetch(
                "/api/bookmarks",
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            console.log(
                data.message ||
                "Could not load bookmarks."
            );

            return;
        }


        bookmarks =
            data.map(
                bookmark => ({
                    ...bookmark,
                    id: bookmark._id
                })
            );


        renderBookmarks();


    } catch (error) {

        console.log(error);

    }
}


/* =========================
   LOAD COLLECTIONS
========================= */

async function loadCollectionsFromAPI() {

    const token =
        localStorage.getItem(
            "token"
        );

    if (!token) {
        return;
    }

    try {

        const response =
            await fetch(
                "/api/collections",
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            console.log(
                data.message ||
                "Could not load collections."
            );

            return;
        }


        collectionsData =
            data;


        collections =
            data.map(
                collection =>
                    collection.name
            );


        if (
            !collections.includes(
                "General"
            )
        ) {

            collections.unshift(
                "General"
            );
        }


        renderCollections();


    } catch (error) {

        console.log(error);

    }
}


/* =========================
   START BACKEND DATA
========================= */

if (
    localStorage.getItem("token")
) {

    loadCollectionsFromAPI();

    loadBookmarksFromAPI();

} else {

    renderCollections();

    renderBookmarks();
}
