$(document).ready(function () {
  let stepCounter = 0; // Ajoutez ce compteur pour suivre l'étape actuelle

  function handleInputUpdate(hiddenFormSelector, isSecondStep) {
    const id = $(this).attr("id");
    const hiddenId = isSecondStep ? `hidden-${id}-second` : `hidden-${id}`;
    $(`#${hiddenId}`).val($(this).val());

    let allFieldsFilled = true;
    $(
      `${hiddenFormSelector} input, ${hiddenFormSelector} select, ${hiddenFormSelector} textarea`
    ).each(function () {
      if (this.id === "comment" || this.id === "role") {
        // Ignore the comment and role fields
        return true;
      }
      if ($(this).is("input") && !$(this).val()) {
        allFieldsFilled = false;
        return false;
      }
      if ($(this).is("select") && $(this).val() === "") {
        allFieldsFilled = false;
        return false;
      }
      if ($(this).is("textarea") && $(this).val().trim() === "") {
        allFieldsFilled = false;
        return false;
      }
    });

    if (allFieldsFilled) {
      $(hiddenFormSelector).data("readyToSubmit", true);
    } else {
      $(hiddenFormSelector).data("readyToSubmit", false);
    }
  }

  $("#company_name, #company_size, #role, #industry, #comment").on(
    "change",
    function () {
      handleInputUpdate.call(this, ".hiddenform_steptwo", ".w-button", true);
    }
  );
  $("#name, #email, #tool").on("change", function () {
    handleInputUpdate.call(this, ".hiddenform_stepone", false);
  });

  $("#company_name, #company_size, #role, #industry, #comment").on(
    "change",
    function () {
      handleInputUpdate.call(this, ".hiddenform_steptwo", ".w-button", true);
    }
  );

  $(".form_account input, .form_account select").on("change", function () {
    handleInputUpdate.call(this, ".hiddenform_steptwo", ".w-button", true);
  });

  $(".form_account textarea").on("blur", function () {
    handleInputUpdate.call(this, ".hiddenform_steptwo", ".w-button", true);
  });
  // Création d'un observer pour écouter les changements dans le DOM
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      for (var i = 0; i < mutation.addedNodes.length; i++) {
        var node = mutation.addedNodes[i];
        if ($(node).hasClass("loom-block") && $(node).is(":visible")) {
          // Submit the form and remove the hidden form when the loom block is visible
          $(".hiddenform_steptwo .w-button").click();
          setTimeout(() => $(".hiddenform_steptwo").remove(), 500);
          observer.disconnect();
        }
      }
    });
  });

  // Configuration de l'observer
  var observerConfig = {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true
  };

  // Commencer l'observation
  observer.observe(document.body, observerConfig);

  const genericEmailDomains = ["gmail.com", "yahoo.com", "hotmail.com"];

  function isEmailValid(email) {
    const regex = /^[\w-+]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
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
      // Change the error message
      const email = $("#email").val().trim();
      if (!isEmailValid(email)) {
        $(".error").text("Please enter a valid email");
      } else if (isEmailGeneric(email)) {
        $(".error").text("Please use your professional email");
      }
      return false;
    }

    return true;
  }

  $("#next").on("click", function () {
    if (validateVisibleInputs()) {
      // Incremente le compteur seulement si tous les inputs sont valides
      stepCounter++;

      $(".error").text("").hide();
      const currentQuestion = $(".question:visible");
      currentQuestion.hide();
      currentQuestion.next(".question").show();

      // Met à jour les boutons de navigation
      toggleNavigationButtons();

      // Si le compteur atteint 2 (c'est-à-dire la deuxième étape), soumettez le formulaire hiddenform_stepone
      if (stepCounter === 2 && $(".hiddenform_stepone").data("readyToSubmit")) {
        $(".hiddenform_stepone .w-button").click();
      }

      // Si le compteur atteint 4 (c'est-à-dire la quatrième étape), soumettez le formulaire hiddenform_steptwo
      if (stepCounter === 4 && $(".hiddenform_steptwo").data("readyToSubmit")) {
        $(".hiddenform_steptwo .w-button").click();
      }
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
$(document).on("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    $("#next").trigger("click");
  }
});
