const eventListener = () => {
    document.getElementById('btn').addEventListener('click', () => {
        window.location.href = '/#main4'
    })
    document.getElementById('btn2').addEventListener('click', () => {
        window.location.href = '/#main4'
    })
    document.getElementById('btn3').addEventListener('click', () => {
        window.location.href = '/#main4'
    })
    document.getElementById('submit').addEventListener('click', () => {
        formSubmit()
    })
    document.getElementById('mobilesubmit').addEventListener('click', () => {
        formSubmit()
    })
}

const formSubmit = () => {
    const form = {}
    if (getWidth() <= 1122) {
        form.fname = document.getElementById('mfname').value 
        form.lname = document.getElementById('mlname').value
        form.email = document.getElementById('memail').value
        form.bname = document.getElementById('mbname').value
    } else {
        form.fname = document.getElementById('fname').value
        form.lname = document.getElementById('lname').value
        form.email = document.getElementById('email').value
        form.bname = document.getElementById('bname').value
    }

    if (form.fname == '' || form.lname == '' || form.email == '' || form.bname == '') {
        document.getElementById('error').style.opacity = 1
        document.getElementById('mobileerror').style.opacity = 1
    } else {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", 'https://goodhandhauling.com/', true)
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify(form))
        document.getElementById('error').style.display = 0
        document.getElementById('mobileerror').style.display = 0
    }
}

const getWidth = () => {
    return Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth
    )
}

eventListener()
