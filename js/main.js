    const sideBar = $(".sideBar");
    const innerBar = $(".innerBar");
    let innerBarWidth = innerBar.innerWidth();
    sideBar.css("left", -innerBarWidth);
    const navLinks = $(".navLinks li");
    const dataContainer = $("#mealsData");
    const searchContainer = $("#searchBox");
    const contactContainer = $("#contactBox");  

    // Nav Bar 

    function openSideBar() {
      sideBar.animate({ left: 0 }, 500);
    $(".openCloseBtn i").removeClass("fa-solid fa-bars fa-2x");
    $(".openCloseBtn i").addClass("fa-solid fa-xmark fa-2x");
      for (let i = 0; i < navLinks.length; i++) {
        const delay = 100 * i;
        navLinks.eq(i).delay(delay).animate({ top: 0 }, 500);
      }
    }

    function closeSideBar() {
      sideBar.animate({ left: -innerBarWidth }, 500);
      $(".openCloseBtn i").removeClass("fa-solid fa-xmark fa-2x");
      $(".openCloseBtn i").addClass("fa-solid fa-bars fa-2x");
    }  
    $(".openCloseBtn").on("click", function () {
      if (sideBar.css("left") == "0px") {
        closeSideBar();
      } else {
        openSideBar();
      }
    });  
    
    //API
    let meals = []; 
    async function getMeals() {
      let mealAPI = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=`
      );
      let apiResonse = await mealAPI.json();
      meals = apiResonse.meals;
      displayMeals();
    } 
    getMeals(); 
    function displayMeals() {
      let mealsData = [];
      for (let i = 0; i < meals.length; i++) {
        let imgSrc = meals[i].strMealThumb;
        let mealName = meals[i].strMeal;
        let mealId = meals[i].idMeal;
        mealsData += `
        <div class="col-md-4 col-lg-3">
                      <div class="item">
                          <img src="${imgSrc}"  class="w-100" alt="${mealName}">
                          <div class="layer"><h2 data-id="${mealId}">${mealName}</h2></div>
                      </div>
                  </div>`;
      }
      dataContainer.html(`${mealsData}`); 
      $(".item").on("click", function () {
        let item = $(this);
        let mealId = item.find("h2").attr("data-id");
        getMealById(mealId);
      });
    } 
    function displayInstructions(meal) {
      $("#mealsData").html("");
      let Ingredients = [];
      for (let i = 0; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
          Ingredients += `<li class="alert alert-info m-2 p-1">${
            meal[`strMeasure${i}`]
          } ${meal[`strIngredient${i}`]}</li>`;
        }
      }     
    let tags = meal.strTags?.split(",")
    if (!tags) tags = []
    let tagsStr = ''
    for (let i = 0; i < tags.length; i++) {
        tagsStr += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
    }
      let mealInfo = ` 
              <div class="col-lg-4">
                <img src="${meal.strMealThumb}"class="rounded-2 w-100 mb-3" alt="" />
                <h2>${meal.strMeal}</h2>
              </div>
              <div class="col-lg-8">
                  <h2 class="fw-bold">Instructions</h2>
                  <p>${meal.strInstructions}</p>
                  <h3><span class="fw-bold">Area: </span>${meal.strArea}</h3>
                  <h3><span class="fw-bold">Category: </span>${meal.strCategory}</h3>
                  <h3><span class="fw-bold">Recipes:</span></h3>
                  <ul class="list-unstyled d-flex flex-wrap g-3">
                      ${Ingredients}
                  </ul>
                    <h3><span class="fw-bold">Tags:</span></h3>
                  <ul class="list-unstyled d-flex flex-wrap g-3">
                      ${tagsStr}
                  </ul>
                  <a href="${meal.strSource}" class="btn btn-success" >Source</a>
                  <a href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
              </div>`; 
      dataContainer.html(`${mealInfo}`);
      searchContainer.html("")
    }      
    async function getMealsByName(meal) {   
      let mealAPI = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${meal}`
      );
      let apiResonse = await mealAPI.json();
      meals = apiResonse.meals;
      displayMeals();         
    } 
    async function getMealsByFirstLetter(letter) {   
      let mealAPI = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
      ); 
      let apiResonse = await mealAPI.json();
      meals = apiResonse.meals;
      displayMeals();  
    }  
    navLinks.eq(0).on("click", function () {
      dataContainer.html("");
      contactContainer.html("");
      closeSideBar();
      searchMealInputs();
      sideBar.css("z-index", 99999);
    }); 
    function searchMealInputs() {
      let searchInputs = `
        <div class="col-md-6">
                <input type="text" class="inputByName form-control bg-transparent text-white" placeholder="Search By Name" />
         </div>
         <div class="col-md-6">
                <input type="text" maxlength="1" class="inputByLetter form-control bg-transparent text-white" placeholder="Search By First Letter"/>
         </div>`;
        searchContainer.html(`${searchInputs}`); 
      $(".inputByName").on("input", function () {
        let searchInput = $(this).val();
        getMealsByName(searchInput);     
      });
      $(".inputByLetter").on("input", function () {
        let searchInputLetter = $(this).val();
        getMealsByFirstLetter(searchInputLetter);
      });
    }
    navLinks.eq(1).on("click", function () {
      dataContainer.html("");
      searchContainer.html("");
      contactContainer.html("");
      closeSideBar();
      getCategories();
    }); 
    let categories = [];
    async function getCategories() {   
      let mealAPI = await fetch(
        `https://www.themealdb.com/api/json/v1/1/categories.php`
      );
      let apiResonse = await mealAPI.json();
      categories = apiResonse.categories; 
      displayCategories();  
    } 
    function displayCategories() {
      let categoryData = ``;
      for (let i = 0; i < categories.length; i++) {
        let imgSrc = categories[i].strCategoryThumb;
        let category = categories[i].strCategory;
        let categoryDes = categories[i].strCategoryDescription
        categoryData += `
        <div class="col-sm-6 col-md-4 col-lg-3">
                      <div class="item position-relative">
                          <img src="${imgSrc}" class="w-100"  alt="${category}">
                          <div class="layer position-absolute  text-center d-flex flex-column justify-content-center align-items-center"><h2 class="mb-2 h3 fw-bold">${category}</h2>
                          <p class="text-black text-center pdata ">${categoryDes.split(" ").slice(0,20).join(" ")}</p></div>
                      </div>
         </div>`;
      }
      dataContainer.html(`${categoryData}`);  
      $(".item").on("click", function () {
        let item = $(this);
        let category = item.find("h2").html();
        let categoryDes = item.find("p").html();
        displayMealsByCategory(category,categoryDes);  
      });
    }    
    let filteredMeals = []; 
    async function displayMealsByCategory(category) {  
      let mealAPI = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
      ); 
      let apiResonse = await mealAPI.json();
      filteredMeals = apiResonse.meals; 
      displayFilteredMeals();   
    } 
    function displayFilteredMeals() {
      let mealsData = ``;
      for (let i = 0; i < filteredMeals.length; i++) {
        let imgSrc = filteredMeals[i].strMealThumb;
        let mealName = filteredMeals[i].strMeal;
        let mealId = filteredMeals[i].idMeal;
        mealsData += `
        <div class="col-md-3">
                      <div class="item">
                          <img src="${imgSrc}" class="w-100" loading="lazy" alt="${mealName}">
                          <div class="layer"><h2 data-id="${mealId}">${mealName}</h2></div>
                      </div>
         </div>`;
      }
      dataContainer.html(`${mealsData}`);
      $(".item").on("click", function () {
        let item = $(this);
        let mealId = item.find("h2").attr("data-id");
        getMealById(mealId);
      });
    } 

    async function getMealById(mealId) {  
      let mealAPI = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
      ); 
      let apiResonse = await mealAPI.json();
      const meal = apiResonse.meals[0];     
      displayInstructions(meal);   
    } 

    navLinks.eq(2).on("click", function () {
      dataContainer.html("");
      searchContainer.html("");
      contactContainer.html("");
      closeSideBar();
      getAreas();
    });
  
    let areas = []; 
    async function getAreas() {  
      let mealAPI = await fetch(
        `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
      );
  
      let apiResonse = await mealAPI.json();
      areas = apiResonse.meals;
      displayAreas();   
    }
    function displayAreas() {
      let areaInfo = ``;
      for (let i = 0; i < areas.length; i++) {
        areaInfo += `
          <div class="col-sm-6 col-md-4 col-lg-3 text-center area">
                <i class="fa-solid fa-house-laptop fa-4x mb-2"></i>
                <h3>${areas[i].strArea}</h3>
              </div> `;
      }
  
      dataContainer.html(`${areaInfo}`);
      $(".area").on("click", function () {
        let item = $(this);
        let area = item.find("h3").html();
        getMealsByArea(area);
      });
    }
    async function getMealsByArea(area) {   
      let mealAPI = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
      ); 
      let apiResonse = await mealAPI.json();
      filteredMeals = apiResonse.meals;
      displayFilteredMeals(); 
    } 
    navLinks.eq(3).on("click", function () {
      dataContainer.html("");
      searchContainer.html("");
      contactContainer.html("");
      closeSideBar();
      getIngredients();
    }); 
    let mealIngredients = [];
    async function getIngredients() {
      let mealAPI = await fetch(
        `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
      );
      let apiResonse = await mealAPI.json();
      mealIngredients = apiResonse.meals;
      displayingredients(); 
    } 
    function displayingredients() {
      let ingredientsInfo = ``;    
      for (let i = 0; i < 20; i++) {
        ingredientsInfo += `
          <div class="col-sm-6 col-md-4 col-lg-3 text-center ingredient">
                <i class="fa-solid  fa-drumstick-bite fa-4x"></i>
                <h3>${mealIngredients[i].strIngredient}</h3>
          </div>
        `;
      } 
      dataContainer.html(`${ingredientsInfo}`);
      $(".ingredient").on("click", function () {
        let item = $(this);
        let ingredient = item.find("h3").html();
        getMealsByingredient(ingredient);
      });
    }
    async function getMealsByingredient(ingredient) { 
      let mealAPI = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
      );
      let apiResonse = await mealAPI.json();
      filteredMeals = apiResonse.meals;
      displayFilteredMeals();
    }
    navLinks.eq(4).on("click", function () {
      dataContainer.html("");
      searchContainer.html("");
      closeSideBar();
      getContactInputs();
    });

    function getContactInputs() {
      let contactInputs = `
         <div class="container min-vh-100 d-flex flex-column justify-content-center align-items-center">
                <div class="row g-3">
                  <div class="col-md-6">
                    <input
                      type="text"
                      placeholder="Enter Your Name"
                      class="nameInput form-control bg-white text-black"/>
                    <p class="mt-3 fw-bold d-none text-black alert alert-danger" id="nameWarning">
                      Special characters and numbers not allowed
                    </p>
                  </div>
                  <div class="col-md-6">
                    <input
                      type="email"
                      placeholder="Enter Your Email"
                      class="emailInput form-control bg-white text-black"
                    />
                    <p class="mt-3 fw-bold d-none text-black alert alert-danger" id="emailWarning">
                      Email not valid *exemple@yyy.zzz
                    </p>
                  </div>
                  <div class="col-md-6">
                    <input
                      type="text"
                      placeholder="Enter Your Phone"
                      class="phoneInput form-control bg-white text-black"
                    />
                    <p class="mt-3 fw-bold d-none text-black alert alert-danger" id="phoneWarning">
                      Enter valid Phone Number
                    </p>
                  </div>
                  <div class="col-md-6">
                    <input
                      type="number"
                      placeholder="Enter Your Age"
                      class="ageInput form-control bg-white text-black"
                    />
                    <p class="mt-3 fw-bold d-none text-black alert alert-danger" id="ageWarning">
                      Enter valid age
                    </p>
                  </div>
                  <div class="col-md-6">
                    <input
                      type="password"
                      placeholder="Enter Your Password"
                      class="passwordInput form-control bg-white text-black"
                    />
                    <p class="mt-3 fw-bold d-none text-black alert alert-danger" id="passwordWarning">
                      Enter valid password *Minimum 8 characters, at least one
                      letter and one number*
                    </p>
                  </div>
                  <div class="col-md-6">
                    <input
                      type="password"
                      placeholder="Re-Password"
                      class="repasswordInput form-control bg-white text-black"
                    />
                    <p class="mt-3 fw-bold d-none text-black alert alert-danger" id="repasswordWarning">
                      Enter valid repassword
                    </p>
                  </div>
                </div>
                 <button disabled="true" id="submitBtn" class="btn btn-outline-danger mt-3 px-4">
                Submit
              </button>
              </div>`;
  
      contactContainer.html(`${contactInputs}`);
  
     //input
      const usernameInput = $(".nameInput");
      const emailInput = $(".emailInput");
      const phoneInput = $(".phoneInput");
      const ageInput = $(".ageInput");
      const passwordInput = $(".passwordInput");
      const repasswordInput = $(".repasswordInput");
      const submitBtn = $("#submitBtn");

      //warning
      const nameWarning = document.getElementById("nameWarning");
      const emailWarning = document.getElementById("emailWarning");
      const phoneWarning = document.getElementById("phoneWarning");
      const ageWarning = document.getElementById("ageWarning");
      const passwordWarning = document.getElementById("passwordWarning");
      const repasswordWarning = document.getElementById("repasswordWarning");
  
      //validation
      usernameInput.on("input", function () {
        if (nameValidation(usernameInput.val())) {
          enableBtn();
          nameWarning.classList.add("d-none");
        } else {
          nameWarning.classList.remove("d-none");
          submitBtn.attr("disabled", true);
        }
      });
  
      emailInput.on("input", function () {
        if (emailValidation(emailInput.val())) {
          enableBtn();
          emailWarning.classList.add("d-none");
        } else {
          emailWarning.classList.remove("d-none");
          submitBtn.attr("disabled", true);
        }
      });
  
      phoneInput.on("input", function () {
        if (phoneValidation(phoneInput.val())) {
          enableBtn();
          phoneWarning.classList.add("d-none");
        } else {
          phoneWarning.classList.remove("d-none");
          submitBtn.attr("disabled", true);
        }
      });
  
      ageInput.on("input", function () {
        if (ageValidation(ageInput.val())) {
          enableBtn();
          ageWarning.classList.add("d-none");
        } else {
          ageWarning.classList.remove("d-none");
          submitBtn.attr("disabled", true);
        }
      });
  
      passwordInput.on("input", function () {
        if (passwordValidation(passwordInput.val())) {
          enableBtn();
          passwordWarning.classList.add("d-none");
        } else {
          passwordWarning.classList.remove("d-none");
          submitBtn.attr("disabled", true);
        }
      });
  
      repasswordInput.on("input", function () {
        if (repasswordValidation(repasswordInput.val())) {
          enableBtn();
          repasswordWarning.classList.add("d-none");
        } else {
          repasswordWarning.classList.remove("d-none");
          submitBtn.attr("disabled", true);
        }
      });
      function nameValidation(userName) {
        const nameRegex = /^[a-zA-Z ]+$/;
        return nameRegex.test(userName);
      }
  
      function emailValidation(email) {
        const emailRegex =
         /^[a-zA-Z ]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/ ;
        return emailRegex.test(email);
      }
  
      function phoneValidation(phone) {
        const phoneRegex =
          /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        return phoneRegex.test(phone);
      }
  
      function ageValidation(age) {
        const ageRegex = /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|150)$/;
        return ageRegex.test(age);
      }
  
      function passwordValidation(password) {
        const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/;
        return passwordRegex.test(password);
      }
  
      function repasswordValidation(repassword) {
        return repassword == passwordInput.val();
      }
  
      function enableBtn() {
        if (
          nameValidation(usernameInput.val()) &&
          emailValidation(emailInput.val()) &&
          phoneValidation(phoneInput.val()) &&
          ageValidation(ageInput.val()) &&
          passwordValidation(passwordInput.val()) &&
          repasswordValidation(repasswordInput.val())
        ) {
          submitBtn.attr("disabled", false);
        } else {
          submitBtn.attr("disabled", true);
        }
      }
    };