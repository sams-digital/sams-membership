// ============================================================
// SAMS DIGITAL UNIVERSE
// CLEAN MAIN SCRIPT
// ============================================================

import {
    auth,
    db,
    googleProvider
} from "./firebase-config.js";

import {
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    collection,
    addDoc,
    serverTimestamp,
    query,
    where,
    getDocs,
    limit
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


// ============================================================
// SAMS SETTINGS
// ============================================================

const SAMS = {

    name: "SAMS Digital Universe",

    email: "samsdigitaluniverse@gmail.com",

    whatsapp: "917975760449",

    upi: "irfaneyyyyyyy@oksbi"

};


// ============================================================
// MEMBERSHIP PLANS
// ============================================================

const PLANS = {

    pro: {

        id: "pro",

        name: "SAMS PRO",

        price: 999

    },

    premium: {

        id: "premium",

        name: "SAMS PREMIUM",

        price: 2499

    }

};


// ============================================================
// GLOBAL VARIABLES
// ============================================================

let currentUser = null;

let selectedPlan = null;


// ============================================================
// DOM READY
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "SAMS Digital Universe initializing..."
        );


        setupNavigation();

        setupAnimations();

        setupParallax();

        setupTiltCards();

        setupMagneticButtons();

        setupAuth();

        setupMembershipButtons();

        setupPaymentButtons();

        setupContactButtons();

        setupCounters();


        console.log(
            "SAMS Digital Universe loaded successfully."
        );

    }
);


// ============================================================
// FIREBASE AUTH STATE
// ============================================================

onAuthStateChanged(
    auth,
    async (user) => {

        currentUser = user || null;


        if (user) {

            console.log(
                "Logged in:",
                user.email
            );


            updateAccountButton(user);

            await loadMembership(user);

        }

        else {

            console.log(
                "No user logged in."
            );


            updateAccountButton(null);

        }

    }
);


// ============================================================
// NAVIGATION
// ============================================================

function setupNavigation() {

    const menuToggle =
        document.getElementById(
            "menuToggle"
        );

    const mobileMenu =
        document.getElementById(
            "mobileMenu"
        );


    if (menuToggle && mobileMenu) {

        menuToggle.addEventListener(
            "click",
            () => {

                mobileMenu.classList.toggle(
                    "active"
                );

            }
        );


        mobileMenu
            .querySelectorAll("a")
            .forEach(link => {

                link.addEventListener(
                    "click",
                    () => {

                        mobileMenu.classList.remove(
                            "active"
                        );

                    }
                );

            });

    }


    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(link => {

            link.addEventListener(
                "click",
                event => {

                    const id =
                        link.getAttribute(
                            "href"
                        );


                    if (
                        !id ||
                        id === "#"
                    ) {
                        return;
                    }


                    const target =
                        document.querySelector(
                            id
                        );


                    if (!target) {
                        return;
                    }


                    event.preventDefault();


                    target.scrollIntoView({
                        behavior: "smooth"
                    });

                }
            );

        });


    const header =
        document.getElementById(
            "header"
        );


    window.addEventListener(
        "scroll",
        () => {

            if (!header) {
                return;
            }


            if (
                window.scrollY > 40
            ) {

                header.classList.add(
                    "scrolled"
                );

            }

            else {

                header.classList.remove(
                    "scrolled"
                );

            }

        }
    );

}


// ============================================================
// ACCOUNT BUTTON
// ============================================================

function updateAccountButton(
    user
) {

    const button =
        document.getElementById(
            "accountButton"
        );


    if (!button) {
        return;
    }


    if (user) {

        button.textContent =
            user.displayName ||
            "Account";

    }

    else {

        button.textContent =
            "Login";

    }

}


// ============================================================
// AUTH
// ============================================================

function setupAuth() {

    const accountButton =
        document.getElementById(
            "accountButton"
        );


    const mobileLoginButton =
        document.getElementById(
            "mobileLoginButton"
        );


    const closeButton =
        document.getElementById(
            "closeAuthModal"
        );


    const googleButton =
        document.getElementById(
            "googleAuthButton"
        );


    const emailButton =
        document.getElementById(
            "emailAuthButton"
        );


    if (accountButton) {

        accountButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                openAuthModal();

            }
        );

    }


    if (mobileLoginButton) {

        mobileLoginButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                openAuthModal();

            }
        );

    }


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeAuthModal
        );

    }


    if (googleButton) {

        googleButton.addEventListener(
            "click",
            loginWithGoogle
        );

    }


    if (emailButton) {

        emailButton.addEventListener(
            "click",
            loginOrCreateAccount
        );

    }


    const modal =
        document.getElementById(
            "authModal"
        );


    if (modal) {

        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target === modal
                ) {

                    closeAuthModal();

                }

            }
        );

    }

}


// ============================================================
// OPEN AUTH MODAL
// ============================================================

function openAuthModal() {

    const modal =
        document.getElementById(
            "authModal"
        );


    if (!modal) {

        console.error(
            "Auth modal not found."
        );

        return;

    }


    modal.classList.add(
        "active"
    );


    modal.style.display =
        "flex";


    document.body.classList.add(
        "modal-open"
    );

}


// ============================================================
// CLOSE AUTH MODAL
// ============================================================

function closeAuthModal() {

    const modal =
        document.getElementById(
            "authModal"
        );


    if (!modal) {
        return;
    }


    modal.classList.remove(
        "active"
    );


    modal.style.display =
        "none";


    document.body.classList.remove(
        "modal-open"
    );

}


// ============================================================
// AUTH MESSAGE
// ============================================================

function authMessage(
    message,
    type = ""
) {

    const box =
        document.getElementById(
            "authMessage"
        );


    if (!box) {
        return;
    }


    box.textContent =
        message;


    box.className =
        "auth-message " +
        type;

}


// ============================================================
// EMAIL LOGIN / SIGNUP
// ============================================================

async function loginOrCreateAccount() {

   const user = auth.currentUser;

const studentName =
    user?.displayName ||
    document.getElementById("studentName")?.value?.trim() ||
    "Student";


    const email =
        document
            .getElementById(
                "emailInput"
            )
            ?.value
            .trim();


    const password =
        document
            .getElementById(
                "passwordInput"
            )
            ?.value;


    if (!email) {

        authMessage(
            "Please enter your email.",
            "error"
        );

        return;

    }


    if (!password) {

        authMessage(
            "Please enter your password.",
            "error"
        );

        return;

    }


    if (
        password.length < 6
    ) {

        authMessage(
            "Password must contain at least 6 characters.",
            "error"
        );

        return;

    }


    try {

        authMessage(
            "Checking your account..."
        );


        // First try login
        try {

            const result =
                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            currentUser =
                result.user;


            authMessage(
                "Login successful!",
                "success"
            );


            setTimeout(
                () => {

                    closeAuthModal();

                    continueAfterLogin();

                },
                600
            );


            return;

        }

        catch (loginError) {

            // If account doesn't exist,
            // create it.
            if (
                loginError.code !==
                "auth/user-not-found" &&
                loginError.code !==
                "auth/invalid-credential"
            ) {

                throw loginError;

            }

        }


        authMessage(
            "Creating your SAMS account..."
        );


        const result =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );


        if (name) {

            await updateProfile(
                result.user,
                {
                    displayName: name
                }
            );

        }


        currentUser =
            result.user;


        authMessage(
            "Account created successfully!",
            "success"
        );


        setTimeout(
            () => {

                closeAuthModal();

                continueAfterLogin();

            },
            600
        );

    }

    catch (error) {

        console.error(
            "Authentication error:",
            error
        );


        authMessage(
            firebaseError(error),
            "error"
        );

    }

}


// ============================================================
// GOOGLE LOGIN
// ============================================================

async function loginWithGoogle() {

    try {

        authMessage(
            "Opening Google login..."
        );


        const result =
            await signInWithPopup(
                auth,
                googleProvider
            );


        currentUser =
            result.user;


        console.log(
            "Google login successful:",
            currentUser
        );


        authMessage(
            "Google login successful!",
            "success"
        );


        setTimeout(
            () => {

                closeAuthModal();

                continueAfterLogin();

            },
            600
        );

    }

    catch (error) {

        console.error(
            "Google login error:",
            error
        );


        authMessage(
            firebaseError(error),
            "error"
        );

        alert(
            firebaseError(error)
        );

    }

}


// ============================================================
// AFTER LOGIN
// ============================================================

function continueAfterLogin() {

    if (selectedPlan) {

        openPaymentModal();

    }

}


// ============================================================
// MEMBERSHIP BUTTONS
// ============================================================

function setupMembershipButtons() {

    const buttons =
        document.querySelectorAll(
            "[data-plan]"
        );


    console.log(
        "Membership buttons found:",
        buttons.length
    );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();


                    const plan =
                        button.dataset.plan;


                    console.log(
                        "Membership selected:",
                        plan
                    );


                    selectPlan(
                        plan
                    );

                }
            );

        }
    );

}


// ============================================================
// SELECT PLAN
// ============================================================

function selectPlan(
    planID
) {

    if (
        !PLANS[planID]
    ) {

        console.error(
            "Invalid membership plan:",
            planID
        );

        return;

    }


    selectedPlan =
        PLANS[planID];


    console.log(
        "Selected plan:",
        selectedPlan
    );


    updatePaymentDetails();


    if (!currentUser) {

        openAuthModal();

        authMessage(
            `Please login to continue with ${selectedPlan.name}.`
        );

        return;

    }


    openPaymentModal();

}


// ============================================================
// PAYMENT BUTTONS
// ============================================================

function setupPaymentButtons() {

    const upiButton =
        document.getElementById(
            "openUpi"
        );


    const completedButton =
        document.getElementById(
            "paymentCompleted"
        );


    const copyButton =
        document.getElementById(
            "copyUPIButton"
        );


    const closeButton =
        document.getElementById(
            "closePaymentModal"
        );


    if (upiButton) {

        upiButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                openUPI();

            }
        );

    }


    if (completedButton) {

        completedButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                submitPayment();

            }
        );

    }


    if (copyButton) {

        copyButton.addEventListener(
            "click",
            copyUPIID
        );

    }


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closePaymentModal
        );

    }


    const modal =
        document.getElementById(
            "paymentModal"
        );


    if (modal) {

        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target === modal
                ) {

                    closePaymentModal();

                }

            }
        );

    }

}


// ============================================================
// UPDATE PAYMENT DETAILS
// ============================================================

function updatePaymentDetails() {

    if (!selectedPlan) {
        return;
    }


const user = auth.currentUser;

const studentName =
    user?.displayName ||
    document.getElementById("studentName")?.value?.trim() ||
    "Student";


    const price =
        document.getElementById(
            "selectedPlanPrice"
        );


    if (name) {

        name.textContent =
            selectedPlan.name;

    }


    if (price) {

        price.textContent =
            `₹${selectedPlan.price.toLocaleString(
                "en-IN"
            )}`;

    }


    generateQR();

}


// ============================================================
// OPEN PAYMENT MODAL
// ============================================================

function openPaymentModal() {

    const modal =
        document.getElementById(
            "paymentModal"
        );


    if (!modal) {

        console.error(
            "Payment modal not found."
        );

        return;

    }


    updatePaymentDetails();


    modal.classList.add(
        "active"
    );


    modal.style.display =
        "flex";


    document.body.classList.add(
        "modal-open"
    );

}


// ============================================================
// CLOSE PAYMENT MODAL
// ============================================================

function closePaymentModal() {

    const modal =
        document.getElementById(
            "paymentModal"
        );


    if (!modal) {
        return;
    }


    modal.classList.remove(
        "active"
    );


    modal.style.display =
        "none";


    document.body.classList.remove(
        "modal-open"
    );

}


// ============================================================
// UPI
// ============================================================

function getUPILink() {

    if (!selectedPlan) {
        return "";
    }


    return (
        "upi://pay" +
        "?pa=" +
        encodeURIComponent(
            SAMS.upi
        ) +
        "&pn=" +
        encodeURIComponent(
            SAMS.name
        ) +
        "&am=" +
        encodeURIComponent(
            selectedPlan.price.toFixed(2)
        ) +
        "&cu=INR" +
        "&tn=" +
        encodeURIComponent(
            selectedPlan.name +
            " Membership"
        )
    );

}


// ============================================================
// OPEN UPI
// ============================================================

function openUPI() {

    if (!currentUser) {

        openAuthModal();

        return;

    }


    if (!selectedPlan) {

        alert(
            "Please select a membership plan first."
        );

        return;

    }


    window.location.href =
        getUPILink();

}


// ============================================================
// QR CODE
// ============================================================

function generateQR() {

    const container =
        document.getElementById(
            "upiQRCode"
        );


    if (!container) {
        return;
    }


    if (!selectedPlan) {
        return;
    }


    container.innerHTML = "";


    const createQR = () => {

        if (
            typeof QRCode ===
            "undefined"
        ) {

            console.error(
                "QRCode library failed to load."
            );

            return;

        }


        new QRCode(
            container,
            {
                text: getUPILink(),
                width: 220,
                height: 220
            }
        );

    };


    if (
        typeof QRCode !==
        "undefined"
    ) {

        createQR();

        return;

    }


    const existing =
        document.querySelector(
            'script[data-sams-qrcode]'
        );


    if (existing) {

        existing.addEventListener(
            "load",
            createQR
        );

        return;

    }


    const script =
        document.createElement(
            "script"
        );


    script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";


    script.dataset.samsQrcode =
        "true";


    script.onload =
        createQR;


    document.head.appendChild(
        script
    );

}


// ============================================================
// COPY UPI
// ============================================================

async function copyUPIID() {

    try {

        await navigator.clipboard.writeText(
            SAMS.upi
        );


        alert(
            "UPI ID copied:\n" +
            SAMS.upi
        );

    }

    catch {

        alert(
            "UPI ID:\n" +
            SAMS.upi
        );

    }

}


// ============================================================
// SUBMIT PAYMENT
// ============================================================

async function submitPayment() {

    if (!currentUser) {

        openAuthModal();

        return;

    }


    if (!selectedPlan) {

        alert(
            "Please select a membership plan."
        );

        return;

    }


    try {

        const payment = {

            uid:
                currentUser.uid,

            studentName:
                currentUser.displayName ||
                "SAMS Member",

            email:
                currentUser.email ||
                "",

            phone:
                currentUser.phoneNumber ||
                "",

            planId:
                selectedPlan.id,

            planName:
                selectedPlan.name,

            amount:
                selectedPlan.price,

            upiId:
                SAMS.upi,

            status:
                "receipt_pending",

            unlocked:
                false,

            createdAt:
                serverTimestamp()

        };


        const reference =
            await addDoc(
                collection(
                    db,
                    "membershipPayments"
                ),
                payment
            );


        console.log(
            "Payment saved:",
            reference.id
        );


        openWhatsApp(
            reference.id
        );


        alert(
            "Payment recorded. WhatsApp will now open so you can send your receipt to SAMS."
        );


    }

    catch (error) {

        console.error(
            "Payment error:",
            error
        );


        alert(
            "Could not save payment.\n\n" +
            firebaseError(error)
        );

    }

}


// ============================================================
// WHATSAPP
// ============================================================

function openWhatsApp(
    paymentID
) {

    const userName =
        currentUser.displayName ||
        "Student";


    const message =
        `HELLO SAMS DIGITAL UNIVERSE 👋\n\n` +

        `I have completed my membership payment.\n\n` +

        `Name: ${userName}\n` +

        `Email: ${
            currentUser.email || ""
        }\n` +

        `Membership: ${
            selectedPlan.name
        }\n` +

        `Amount: ₹${
            selectedPlan.price
        }\n` +

        `Payment ID: ${
            paymentID
        }\n\n` +

        `I am attaching my payment receipt for verification.`;


    const url =
        `https://wa.me/${SAMS.whatsapp}?text=${
            encodeURIComponent(
                message
            )
        }`;


    window.open(
        url,
        "_blank"
    );

}


// ============================================================
// LOAD MEMBERSHIP
// ============================================================

async function loadMembership(
    user
) {

    try {

        const membershipQuery =
            query(
                collection(
                    db,
                    "memberships"
                ),
                where(
                    "uid",
                    "==",
                    user.uid
                ),
                limit(1)
            );


        const snapshot =
            await getDocs(
                membershipQuery
            );


        if (
            snapshot.empty
        ) {

            return;

        }


        const membership =
            snapshot.docs[0].data();


        console.log(
            "Membership:",
            membership
        );


        const accountButton =
            document.getElementById(
                "accountButton"
            );


        if (
            accountButton &&
            membership.memberId
        ) {

            accountButton.textContent =
                membership.memberId;

        }

    }

    catch (error) {

        console.error(
            "Membership lookup:",
            error
        );

    }

}


// ============================================================
// CONTACT
// ============================================================

function setupContactButtons() {

    // Nothing required here because
    // contact links are normal HTML links.

}


// ============================================================
// ANIMATIONS
// ============================================================

function setupAnimations() {

    const elements =
        document.querySelectorAll(
            ".reveal"
        );


    if (!elements.length) {
        return;
    }


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "visible"
                            );


                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.12
            }
        );


    elements.forEach(
        element =>
            observer.observe(
                element
            )
    );

}


// ============================================================
// PARALLAX
// ============================================================

function setupParallax() {

    const elements =
        document.querySelectorAll(
            "[data-parallax]"
        );


    if (!elements.length) {
        return;
    }


    window.addEventListener(
        "scroll",
        () => {

            const scroll =
                window.scrollY;


            elements.forEach(
                element => {

                    const speed =
                        parseFloat(
                            element.dataset.parallax ||
                            "0.1"
                        );


                    element.style.transform =
                        `translate3d(0, ${
                            scroll * speed
                        }px, 0)`;

                }
            );

        },
        {
            passive: true
        }
    );

}


// ============================================================
// TILT
// ============================================================

function setupTiltCards() {

    const cards =
        document.querySelectorAll(
            ".tilt-card"
        );


    cards.forEach(
        card => {

            card.addEventListener(
                "mousemove",
                event => {

                    const rect =
                        card.getBoundingClientRect();


                    const x =
                        event.clientX -
                        rect.left;


                    const y =
                        event.clientY -
                        rect.top;


                    const centerX =
                        rect.width / 2;


                    const centerY =
                        rect.height / 2;


                    const rotateX =
                        (
                            (y - centerY) /
                            centerY
                        ) * -4;


                    const rotateY =
                        (
                            (x - centerX) /
                            centerX
                        ) * 4;


                    card.style.transform =
                        `perspective(900px)
                         rotateX(${rotateX}deg)
                         rotateY(${rotateY}deg)
                         translateY(-5px)`;

                }
            );


            card.addEventListener(
                "mouseleave",
                () => {

                    card.style.transform =
                        "";

                }
            );

        }
    );

}


// ============================================================
// MAGNETIC
// ============================================================

function setupMagneticButtons() {

    const buttons =
        document.querySelectorAll(
            ".magnetic"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "mousemove",
                event => {

                    const rect =
                        button.getBoundingClientRect();


                    const x =
                        event.clientX -
                        rect.left -
                        rect.width / 2;


                    const y =
                        event.clientY -
                        rect.top -
                        rect.height / 2;


                    button.style.transform =
                        `translate(
                            ${x * 0.08}px,
                            ${y * 0.08}px
                        )`;

                }
            );


            button.addEventListener(
                "mouseleave",
                () => {

                    button.style.transform =
                        "";

                }
            );

        }
    );

}


// ============================================================
// COUNTERS
// ============================================================

function setupCounters() {

    // Reserved for future SAMS statistics.

}


// ============================================================
// FIREBASE ERRORS
// ============================================================

function firebaseError(
    error
) {

    if (!error) {

        return "Something went wrong.";

    }


    switch (
        error.code
    ) {

        case "auth/email-already-in-use":

            return "This email is already registered.";

        case "auth/invalid-email":

            return "Please enter a valid email address.";

        case "auth/weak-password":

            return "Password must contain at least 6 characters.";

        case "auth/user-not-found":

            return "No account exists with this email.";

        case "auth/wrong-password":

            return "Incorrect password.";

        case "auth/invalid-credential":

            return "Incorrect email or password.";

        case "auth/popup-blocked":

            return "Your browser blocked the Google login popup.";

        case "auth/popup-closed-by-user":

            return "Google login was cancelled.";

        case "auth/unauthorized-domain":

            return "This domain is not authorized in Firebase Authentication.";

        case "auth/api-key-not-valid":

            return "Firebase API key is invalid.";

        case "auth/operation-not-allowed":

            return "This authentication method is not enabled in Firebase.";

        case "auth/network-request-failed":

            return "Network error. Check your internet connection.";

        case "permission-denied":

            return "Firestore permission denied. Check your Firebase Security Rules.";

        default:

            return (
                error.message ||
                "Something went wrong."
            );

    }

}


// ============================================================
// ESC KEY
// ============================================================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Escape"
        ) {

            closeAuthModal();

            closePaymentModal();

        }

    }
);


// ============================================================
// GLOBAL FUNCTIONS
// ============================================================

window.selectPlan =
    selectPlan;

window.loginWithGoogle =
    loginWithGoogle;

window.openAuthModal =
    openAuthModal;

window.closeAuthModal =
    closeAuthModal;

window.openPaymentModal =
    openPaymentModal;

window.closePaymentModal =
    closePaymentModal;

window.openUPI =
    openUPI;

window.submitPayment =
    submitPayment;

window.copyUPIID =
    copyUPIID;


console.log(
    "%c SAMS Digital Universe ",
    "font-size:18px;font-weight:800;"
);

console.log(
    "Firebase connected."
);

console.log(
    "Membership system ready."
);