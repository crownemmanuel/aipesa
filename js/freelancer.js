// Freelancer Theme JavaScript

(function($) {
    //var msg = new SpeechSynthesisUtterance('Hello World, how can i help you');
    //msg.lang = 'en-GB'
    //  window.speechSynthesis.speak(msg);

    var msg = new SpeechSynthesisUtterance();
    var voices = window.speechSynthesis.getVoices();
    msg.lang = 'en-GB'
    Speak("Welcome, to A-I-Paysa");


    "use strict"; // Start of use strict

    var accountbalance = 0;
    var CurrentUser = null;
    var username = null;
    var PendingWithdraw = null
    Webcam.set({
        width: 320,
        height: 320,
        image_format: 'jpeg',
        jpeg_quality: 90
    });
    Webcam.attach('#my_camera');
    var gallery_name = "customers";
    var kairos = new Kairos("a9b2d490", "420fea5f03eb5aa0cc439818a3c9099a");

    function ImageRecognized(data) {
        var response = jQuery.parseJSON(data.responseText)

        console.log(response.Errors)
        if (response.Errors || (response.images && response.images[0].transaction
                .status == "failure")) {
            $('.errorLogin').fadeIn();
        } else {

            $('#maincontent').slideUp();
            CurrentUser = response.images[0].transaction.subject_id
            accountbalance = localStorage.getItem(CurrentUser + "_accountbalance");
            username = CurrentUser.replace(/([A-Z])/g, ' $1').trim()

            $("#name").text(username);
            $(".balance-amount").html("$" + accountbalance);
            $("#portfolio").fadeIn();
            var name = FirstName(username);
            Speak("Welcome " + name + ", Your Account Balance is, " +
                accountbalance +
                " Dollars. How may i help you today");
            //Speak("Last time you where here you "
            console.log(response.images[0].transaction.subject_id)
        }

        $('#login_btn').html('<i class="fa fa-key"></i> LOGIN');
    }

    //Fallback Image Recognition for Demo
    function DemoImageRecognition() {
        $('#maincontent').slideUp();
        CurrentUser = "EmmanuelCrown";
        accountbalance = localStorage.getItem(CurrentUser + "_accountbalance");
        username = CurrentUser.replace(/([A-Z])/g, ' $1').trim();

        $("#name").text(username);
        $(".balance-amount").html("$" + accountbalance);
        $("#portfolio").fadeIn();
        var name = FirstName(username);
        Speak("Welcome " + name + ", Your Account Balance is, " +
            accountbalance +
            " Dollars. How may i help you today");
        //Speak("Last time you where here you "
    }


    $('.errorLogin,#tryagain_btn').click(function() {
        $('.errorLogin').fadeOut();
    });

    $('#withdrawbtn').click(function() {
        withDraw("200")
    });
    $('#yesbtn').click(function() {
        withDrawconfirm();
    });

    // Closes the Responsive Menu on Menu Item Click
    $('#login_btn').click(function() {
        //alert(localStorage.getItem("001_username"));
        loginUser()
    });

    //Register button
    $('#register_btn').click(function() {

        $('.intro-text').slideUp();
        setTimeout(function() {
            $('.register').slideDown();
        }, 500);

    });


    function FirstName(name) {
        name = name.split(" ")
        return name[0];
    }

    //Create Account button
    $('#create_account_btn').click(function() {
        $(this).html("Creating Account....");
        //  var id=localStorage.getItem('LastID');
        //  if(id ?id =parseInt(id)+1: id=1);
        var id = $("#full_name").val();
        id = id.toProperCase();

        localStorage.setItem(id + "_accountbalance", getRandomInt(5000, 10000));
        //localStorage.setItem(id+"_username",$("#full_name").val());
        // localStorage.setItem('LastID',id);

        Webcam.snap(function(data_uri) {
            //display results in page
            kairos.enroll(data_uri, gallery_name, id,
                RegistrationSuccessful);
        });


    });

    function Speak(text) {
        msg.text = text;
        speechSynthesis.speak(msg);
    }

    function RegistrationSuccessful(data) {
        var response = jQuery.parseJSON(data.responseText)
        console.log(response);
        alert("You Account has been created");
        $('.intro-text').slideDown();
        setTimeout(function() {
            $('.register').slideUp();
        }, 500);

    }

    String.prototype.toProperCase = function() {
        var output = this.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
        return output.replace(/ /g, "");
    };

    function loginUser() {
        Speak("Please wait, while i verify your Identity");
        $('#login_btn').html("Verying Identity....")
            // take snapshot and get image data
        Webcam.snap(function(data_uri) {
            // display results in page
            setTimeout(DemoImageRecognition, 3000);
            //  kairos.recognize(data_uri, gallery_name, ImageRecognized);
        });
    }


    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    if (annyang) {
        // Add our commands to annyang
        annyang.addCommands({
            'confirm': withDrawconfirm,
            'yes': withDrawconfirm,
            'correct': withDrawconfirm,
            'log me in': function() {
                loginUser()
            },
            'thank you': function() {
                Speak("Your Welcome.")
            }
        });

        annyang.addCallback('resultNoMatch', function(userSaid, commandText,
            phrases) {
            console.log(userSaid);
            for (var i = 0; i < userSaid.length; i++) {
                if (Findstring(userSaid[i], "withdraw")) {
                    console.log("how much");
                    var amount = userSaid[i].match(/\d+/)[0]
                    if (amount) {
                        withDraw(amount);
                    } else {

                    }
                    return true;
                }

                //Login FallBack
                if (Findstring(userSaid[i], "log in") || Findstring(userSaid[i],
                        "log me in")) {
                    loginUser();
                }
            }


        });
        // Tell KITT to use annyang
        SpeechKITT.annyang();

        // Define a stylesheet for KITT to use
        SpeechKITT.setStylesheet(
            '//cdnjs.cloudflare.com/ajax/libs/SpeechKITT/0.3.0/themes/flat.css');

        // Render KITT's interface
        SpeechKITT.vroom();
    }

    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $('.page-scroll a').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top - 50)
        }, 1250, 'easeInOutExpo');
        event.preventDefault();
    });

    // Highlight the top nav as scrolling occurs
    $('body').scrollspy({
        target: '.navbar-fixed-top',
        offset: 51
    });

    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a').click(function() {
        $('.navbar-toggle:visible').click();
    });

    // Offset for Main Navigation
    $('#mainNav').affix({
        offset: {
            top: 100
        }
    })

    // Floating label headings for the contact form
    $(function() {
        $("body").on("input propertychange", ".floating-label-form-group",
            function(e) {
                $(this).toggleClass("floating-label-form-group-with-value", !!$(
                    e.target).val());
            }).on("focus", ".floating-label-form-group", function() {
            $(this).addClass("floating-label-form-group-with-focus");
        }).on("blur", ".floating-label-form-group", function() {
            $(this).removeClass("floating-label-form-group-with-focus");
        });
    });

    function Findstring(string, substring) {
        return string.indexOf(substring) !== -1;
    }


    function withDraw(amount) {
        $(".balance-text").html("Please confirm Withdrawal of")
        $(".balance-amount").html("$" + amount);
        PendingWithdraw = amount;
        Speak("Ok if i had correct, you would like to withDraw " + amount +
            " Dollars, Correct?");
    }

    function withDrawconfirm() {

        if (PendingWithdraw != null) {
            accountbalance = accountbalance - PendingWithdraw
            localStorage.setItem(CurrentUser + "_accountbalance", accountbalance);
            $(".balance-text").html("New Account Balance")
            $(".balance-amount").html("$" + accountbalance);
            Speak(
                "Your transaction was succesful, your new balance is " +
                accountbalance +
                ", please pick your money below the machine, Thank you."
            );
            PendingWithdraw = null;
            $(".succesWithdraw").fadeIn();
            setTimeout(function() {
                $(".succesWithdraw").fadeOut()
            }, 2000);
        }

    }

})(jQuery); // End of use strict