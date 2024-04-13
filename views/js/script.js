// using IIFE
(() => {
    //----------------------------------------------------
    const navigation = {
        home: { title: "Home Page", url: "Home", section: "home" },
        about: { title: "About Page", url: "About", section: "about" },
        posts: { title: "Member Page", url: "Member/Posts", section: "posts" },
        search: { title: "Member Page", url: "Member/Search", section: "search" },
        users: { title: "Admin Page", url: "Admin/Users", section: "users" },
        content: { title: "Admin Page", url: "Admin/Content", section: "content" },
        register: { title: "Register Page", url: "Account/Register", section: "register" },
        login: { title: "Login Page", url: "Account/Login", section: "login" }
    }
    const registerWarning = document.querySelector('#Register div[name="error"]')
    const loginWarning = document.querySelector('#Login div[name="error"]')
    let email = undefined
    //----------------------------------------------------
    /**
     * Utility functions
    */
    //----------------------------------------------------
    const getJSONData = async (url) => {
        const response = await fetch(url)
        const data = await response.json()
        return data
    }
    const postData = async (url = '', data = {}) => {
        // console.log("url", url)
        // Default options are marked with *
        const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        })
        return response.json(); // parses JSON response into native JavaScript objects

        // const response = await fetch(url);
        // console.log(response);
        // return response.json(); // parses JSON response into native JavaScript objects
    }

    const hide = (element) => element.style.display = 'none'
    const show = (element) => element.style.display = 'block'
    const setCopyrightYear = () => {
        var copyrightYear = document.getElementById("copyright");
        var year = new Date().getFullYear();
        copyrightYear.innerText = "© " + year + " " + copyrightYear.innerText;
    }
    //----------------------------------------------------
    /**
     * Client-side RESTful APIs
     *  
     */
    //----------------------------------------------------
    const signup = async (event) => {
        event.preventDefault();
        email = undefined;
        email = document.querySelector('#registrationEmail').value;
        let password = document.querySelector('#registrationPassword').value;
        let confirm = document.querySelector('#confirmRegistrationPW').value;
        console.log(email, password, confirm);

        if (password == confirm) {
            var registerWarning = document.querySelector('#registrationWarning');
            const reply = await postData('/signup', { email, password });
            console.log(reply);

            if (reply.error) {
                registerWarning.innerHTML = `${reply.error}`
                show(registerWarning);
            }
            else if (reply.success) {
                console.log(reply, reply)
                window.history.pushState(navigation.posts, "", `/${navigation.posts.url}`)
                displaySection(navigation.posts)
                authorize(true)
                var welcome = document.querySelector('#welcomeMessage');
                // welcome.classList.add("h6");
                welcome.innerHTML = `Welcome ${email}!`;
                document.querySelector("#pfp").setAttribute("title", email);
            }
        }
        else {
            registerWarning.innerHTML = 'Passwords do not match. Re-enter your password'
            show(registerWarning)
        }
    }
    const signout = async (event) => {
        event.preventDefault()
        console.log(email)
        const reply = await postData('/signout', { email })
        if (reply.success) {
            console.log('inside signout')
            console.log(reply.success)
            console.log(reply, reply)
            window.history.pushState(navigation.home, "", `/${navigation.home.url}`)
            displaySection(navigation.home)
            authorize(false);
        } else {
            console.log(reply);
        }
    }
    const signin = async (event) => {
        event.preventDefault();
        email = undefined;
        email = document.querySelector('#loginEmail').value;
        console.log(email);
        let password = document.querySelector('#loginPassword').value;
        const reply = await postData('/signin', { email, password });
        var loginWarning = document.querySelector('#loginWarning');
        if (reply.error) {
            loginWarning.innerHTML = `${reply.error}`
            show(loginWarning)
        }
        else if (reply.success) {
            console.log(reply, reply);
            window.history.pushState(navigation.posts, "", `/${navigation.posts.url}`);
            displaySection(navigation.posts);
            authorize(true);
            var welcome = document.querySelector('#welcomeMessage');
            welcome.innerHTML = `Welcome ${email}!`;
            document.querySelector("#pfp").setAttribute("title", email);
        }
    }

    const test = async (event) => {
        event.preventDefault();
        const reply = await fetch('/test', {"test": "json"});
        if (reply.status == 200) {
            console.log("Test success!");
        }
    }

    const randomImage = (event) => {
        let firstImage = document.getElementById("image1");
        let secondImage = document.getElementById("image2");
        let thirdImage = document.getElementById("image3");

        if (!firstImage.hasChildNodes()) {
            let randomNum1 = Math.floor(Math.random() * 100);
            let randomNum2 = Math.floor(Math.random() * 100);
            let randomNum3 = Math.floor(Math.random() * 100);
    
            let random1 = document.createElement('img');
            let random2 = document.createElement('img');
            let random3 = document.createElement('img');
    
            fetch("https://picsum.photos/v2/list?&limit=100")
                .then(response => response.json())
                .then(data => {
                    Object.keys(data).forEach(num => {
                        if (data[num].id == randomNum1) {
                            random1.setAttribute('src', data[num].download_url);
                        } else if (data[num].id == randomNum2) {
                            random2.setAttribute('src', data[num].download_url);
                        } else if (data[num].id == randomNum3) {
                            random3.setAttribute('src', data[num].download_url);
                        }
                    });
    
                    firstImage.appendChild(random1);
                    random1.classList.add("d-block", "w-50", "mx-auto");
                    secondImage.appendChild(random2);
                    random2.classList.add("d-block", "w-50", "mx-auto");
                    thirdImage.appendChild(random3);
                    random3.classList.add("d-block", "w-50", "mx-auto");
            });
        }
    }

    const setActivePage = (section) => {
        console.log(section)
        let menuItems = document.querySelectorAll('a[data-page]')
        menuItems.forEach(menuItem => {
            if (section === menuItem.textContent)
                menuItem.classList.add("active")
            else
                menuItem.classList.remove("active")
        })
    }
    const displaySection = (state) => {
        console.log("displaySection state: " + JSON.stringify(state) + "\ndisplaySection section: " + state.section);
        const sections = document.querySelectorAll('section')
        sections.forEach(section => {
            let name = section.getAttribute('id')
            console.log("displaySection name: " + name);
            if (name === state.section) {
                document.title = state.title
                show(section)
                setActivePage(name)
            }
            else
                hide(section)
        })
    }
    const authorize = (isAuthenticated) => {
        const authenticated = document.querySelectorAll('[data-authenticated]')
        const nonAuthenticated = document.querySelector('[data-nonAuthenticated]')
        if(isAuthenticated) { 
            authenticated.forEach(element => show(element))
            hide(nonAuthenticated)
        }
        else {
            authenticated.forEach(element => hide(element))
            show(nonAuthenticated)
        }
    }

    document.getElementById("modalclose").addEventListener("click", () => {
        const check = document.getElementById("termCheck");
        if (check.checked) {
            const modal = document.querySelector("dialog");
            modal.close();
            modal.classList.add("visually-hidden");
        }
    })

    // Handle forward/back buttons
    window.onpopstate = (event) => {
        // If a state has been provided, we have a "simulated" page
        // and we update the current page.
        if (event.state) {
            // Simulate the loading of the previous page
            displaySection(event.state)
        }
    }

    // const showPfp = (event) => {
    //     const profilePicture = document.querySelector("#pfp");
    //     profilePicture.title = 
    // }



    document.addEventListener("DOMContentLoaded", () => {
        displaySection(navigation.home)
        window.history.replaceState(navigation.home, "", document.location.href);
        setCopyrightYear();
        document.onclick = (event) => {
            const page = event.target.getAttribute('data-page')
            if (page) {
                console.log(page);
                console.log("navigation[page] = " + JSON.stringify(navigation[page]));
                event.preventDefault()
                window.history.pushState(navigation[page], "", `/${navigation[page].url}`)
                displaySection(navigation[page]);
            }
        }
        authorize(false);

        const modal = document.querySelector("dialog");
        modal.showModal();

        const errors = document.querySelectorAll('section div[name="error"]')
        errors.forEach(error => hide(error))

        signupButton = document.querySelector("#registrationSubmit");
        signupButton.addEventListener("click", signup);

        loginButton = document.querySelector("#loginSubmit");
        loginButton.addEventListener("click", signin);

        signoutButton = document.querySelector("#signout");
        signoutButton.addEventListener("click", signout);

        // profilePicture = document.querySelector("#pfp");
        // profilePicture.addEventListener("mouseover", showPfp);

        testButton = document.querySelector("#test");
        testButton.onclick = test;

        imageButton = document.querySelector("#image");
        imageButton.onclick = randomImage;

            // document.querySelector("#signup").onclick = signup;
            // document.querySelector("#signout").onclick = signout;
            // document.querySelector("#signin").onclick = signin;
    })
    //----------------------------------------------------
})()
