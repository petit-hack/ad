$(document).ready(function () {
  // Initialise intl-tel-input
  const phoneInput = document.querySelector("#phone");
  const iti = window.intlTelInput(phoneInput, {
    separateDialCode: true,
    utilsScript:
      "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.13/js/utils.js"
  });

  // Fonction de validation du numéro de téléphone
  function isPhoneNumberValid() {
    const phoneNumber = iti.getNumber();
    const isValid = iti.isValidNumber();
    if (!isValid) {
      $("#phone").css("border-color", "red");
      $(".error").text("Please enter a valid phone number").show();
    } else {
      $("#phone").css("border-color", "");
      $(".error").text("").hide();
    }
    return isValid;
  }
  const genericEmailDomains = ["gmail.com", "yahoo.com", "hotmail.com"];

  function isEmailValid(email) {
    const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return regex.test(email);
  }

  function isEmailGeneric(email) {
    const domain = email.split("@")[1];
    return genericEmailDomains.includes(domain);
  }
  function toggleNavigationButtons() {
    const currentQuestion = $(".question:visible");
    const isLastQuestion = currentQuestion.is($(".question:last"));

    if (isLastQuestion) {
      $("#next").hide();
    } else {
      $("#next").show();
    }
  }
  function resetInput() {
    $("#email").css("border-color", "#838394");
    $(".error").text("").hide();
  }

  $("#email").on("change", function () {
    const email = $(this).val().trim();

    if (email.length === 0) {
      resetInput();
      return;
    }

    if (!isEmailValid(email)) {
      $("#email").css("border-color", "red");
      $(".error").text("Please enter a valid email").show();
      return;
    }

    if (isEmailGeneric(email)) {
      $("#email").css("border-color", "red");
      $(".error").text("Please use your professional email").show();
    } else {
      resetInput();
    }
  });
  $(phoneInput).on("blur", function () {
    isPhoneNumberValid();
  });

  // Cache toutes les div .question sauf la première
  $(".question:not(:first)").hide();
  // Cache le bouton #submit
  $("#submition").hide();

  function resetInputBorderColor(input) {
    $(input).css("border-color", "#838394");
  }

  function validateVisibleInputs() {
    let allInputsFilled = true;

    $(".question:visible input").each(function () {
      const inputVal = $(this).val().trim();
      if (inputVal.length === 0) {
        $(this).css("border-color", "red");
        allInputsFilled = false;
      } else {
        resetInputBorderColor(this);
      }
    });

    if (!allInputsFilled) {
      $(".error").text("All fields are mandatory").show();
      return false;
    }

    // Si un message d'erreur est affiché, empêcher de passer à l'étape suivante
    if ($(".error").is(":visible")) {
      return false;
    }

    return true;
  }

  $("#next").on("click", function () {
    if (validateVisibleInputs()) {
      $(".error").text("").hide();
      const currentQuestion = $(".question:visible");
      currentQuestion.hide();
      currentQuestion.next(".question").show();

      // Met à jour les boutons de navigation
      toggleNavigationButtons();
    } else {
      $(".error").text("All fields are mandatory").show();
    }
  });
  window.addEventListener("message", function (event) {
    if (event.data.event === "calendly.event_scheduled") {
      // Soumet le formulaire
      $("#submition").click();
    }
  });

  // Supprime la bordure rouge lors de la sélection d'un input
  $(document).on("focus", ".question input", function () {
    resetInputBorderColor(this);
  });

  // Empêche la soumission du formulaire avec la touche Entrée et déclenche le clic sur #next
  $("form").on("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      $("#next").trigger("click");
    }
  });
  function applyImageSources() {
    $(".fs-combobox_option").each(function () {
      const textDrop = $(this).find(".text-drop").text().trim();
      const targetItem = $(".select_list .item_model").filter(function () {
        return (
          $(this)
            .find('div[fs-cmsselect-element="text-value"]')
            .text()
            .trim() === textDrop
        );
      });

      if (targetItem.length > 0) {
        const imgSrc = targetItem.find(".select_img").attr("src");
        $(this).find(".fs-combobox_icon").attr("src", "");
        $(this).find(".fs-combobox_icon").attr("src", imgSrc);
      } else {
        console.log("Aucune correspondance trouvée pour : " + textDrop);
      }
    });
  }
  $(".fs-combobox_input.w-input").on("click", function () {
    setTimeout(applyImageSources, 500);
  });
  $(".fs-combobox_input.w-input").on("change", function () {
    setTimeout(applyImageSources, 200);
  });
  setTimeout(applyImageSources, 1500); // Attendre 1,5 secondes (1500 ms) avant d'exécuter la fonction
  $(".fs-combobox_input").on("change", function () {
    var selectedValue = $(this).val();
    var imgSrc = $("[fs-cmsselect-element]:contains('" + selectedValue + "')")
      .siblings("img.select_img")
      .attr("src");

    $(".img-selected").attr("src", imgSrc).show();
  });
  setTimeout(function () {
    $(".landing-demo-form.v2#load").hide();
    $("#signup").show();
  }, 1200);
});
