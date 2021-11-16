const form = document.getElementById("form");
const formBtn = document.getElementById("form-btn");
const formBtnText = document.getElementById("btn-load");
const loading = document.querySelector(".loading");
const data = document.querySelector(".data");
const result = document.querySelector(".result");
const copy = document.querySelector(".copy");
const share = document.querySelector(".share");
const overlay = document.querySelector(".overlay");

const whatsappBtn = document.querySelector(".whatsapp-btn");
const instagramBtn = document.querySelector(".instagram-btn");
const facebookBtn = document.querySelector(".facebook-btn");
const twitterBtn = document.querySelector(".twitter-btn");
const telegramBtn = document.querySelector(".telegram-btn");
const smsBtn = document.querySelector(".sms-btn");
const linkedinBtn = document.querySelector(".linkedin-btn");
const mailBtn = document.querySelector(".mail-btn");

(() => {
  console.log();
  let postUrl = encodeURI(document.querySelector("#alias").value);
  let postTitle = encodeURI("Use this shrink Url instead of long Urls..");

  whatsappBtn.setAttribute(
    "href",
    `https://api.whatsapp.com/send?text=${postTitle} ${postUrl}`
  );

  // instagramBtn.setAttribute("href", ``);

  facebookBtn.setAttribute(
    "href",
    `https://www.facebook.com/sharer.php?u=${postUrl}`
  );
  twitterBtn.setAttribute(
    "href",
    `https://twitter.com/share?url=${postUrl}&text=${postTitle}`
  );
  telegramBtn.setAttribute(
    "href",
    `https://t.me/share/url?url=${postUrl}&text=${postTitle}`
  );

  //sms:{phone_number}?body={url}{text}
  // smsBtn.setAttribute("href", ``);

  linkedinBtn.setAttribute(
    "href",
    `https://www.linkedin.com/shareArticle?url=${postUrl}&title=${postTitle}`
  );
  mailBtn.setAttribute(
    "href",
    `mailto:?subject=${postTitle}&body=${postUrl} ${postTitle}`
  );
})();

form?.addEventListener("submit", (e) => {
  e.preventDefault();
  //   console.log(loading);
  //   loading.classList.add("fa-spinner");

  formBtn.style.cursor = "none";
  $("#btn-load").text(" ");
  $("#btn-load").append('<i class="loading fa fa-spin fa-spinner"></i>');
  let url = document.querySelector(".urlLong");
  let domain = document.querySelector(".domain");
  let alias = document.querySelector(".alias");
  let formData = {
    url: url.value,
    domain: domain.value,
    alias: alias.value,
  };
  $.ajax({
    url: "/form",
    data: formData,
    method: "post",
    success: (response) => {
      // console.log("ajax", response);
      if (response.status) {
        result.classList.remove("hidden");
        data.classList.add("hidden");
        $(".err-a").addClass("hidden");
        $(".alias").removeClass("error");
        $(".err-u").addClass("hidden");
        $(".urlLong").removeClass("error");
        $("#urlLong").val(response.url);
        $("#alias").val(response.shortUrl);
        $(".options a").attr("href", response.url);
      } else {
        formBtn.style.cursor = "pointer";
        $("#btn-load").empty();
        $("#btn-load").text("Shrink Now");
        $(".error-message").text(response.message);
        if (response.err === "a") {
          $(".err-a").removeClass("hidden");
          $(".alias").addClass("error");
        } else if (response.err === "u") {
          $(".err-u").removeClass("hidden");
          $(".urlLong").addClass("error");
        }
      }
    },
  });
});

copy?.addEventListener("click", () => {
  //   console.log("clicked");
  document.querySelector("#alias").select();
  document.execCommand("copy");
  window.getSelection().removeAllRanges();
});

share.addEventListener("click", () => {
  console.log("share..");
  document.querySelector(".container").classList.add("blur");
  overlay.classList.add("active");
  document.querySelector(".ss-media").classList.remove("hidden");
});
overlay?.addEventListener("click", () => {
  console.log("closed");
  document.querySelector(".container").classList.remove("blur");
  overlay.classList.remove("active");
  document.querySelector(".ss-media").classList.add("hidden");
});
