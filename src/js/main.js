import select from './select';
import Swiper from './swiper-bundle.min';
import maskdata from './imask';
import * as getFormsData from './getFormsData';


/* init */
select();
maskdata();
const WOW = require('wowjs');
window.wow = new WOW.WOW();
window.wow.init();
const mySwiper = new Swiper('.swiper-container', {
	// Optional parameters
	direction: 'horizontal',
	loop: true,
	spaceBetween: 40,
	autoHeight: true,
	// Responsive breakpoints
	breakpoints: {
		1200: {
			autoHeight: false,
		}
	},
	// If we need pagination
	pagination: {
		el: '.review-pagination',
		bulletClass: 'review-pagination-bullet',
		bulletActiveClass: 'review-pagination-bullet--active',
		clickable: true,
	},

	// Navigation arrows
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},

	// And if we need scrollbar
	scrollbar: {
		el: '.swiper-scrollbar',
	},
});

/* DOM Selectors */
const burger = document.querySelector('#burger');
const navigationMenu = document.querySelector('#navMenu');
const goToTopButton = document.querySelector('#goToTopBtn');

const submitFormButton = document.querySelector('[data-form-submit]');
const submitContactFormButton = document.querySelector('[data-contact-form-submit]');
const modal = document.querySelector('#modal');
const modalText = document.querySelector('#modalText');
const closeModalButton = document.querySelector('#closeModal');

const DOMFormSelectors = {
	allFormFields: '[data-form-elem]',
	allContactFormFields: '[data-contact-form-elem]'
}; 

// Setup Event Listeners

burger.addEventListener("click", openMenu);

submitFormButton.addEventListener("click", saveFormData(DOMFormSelectors.allFormFields));
submitContactFormButton.addEventListener("click", saveFormData(DOMFormSelectors.allContactFormFields));
closeModalButton.addEventListener("click", hideModal);


function hideModal() {
	modal.classList.remove("active");
}	

function saveFormData(formDataAttribute) {
	return function(e) {
		e.preventDefault();
		let receivedObj = getFormsData.getFormData(formDataAttribute);
		if (receivedObj != undefined) {
			console.log(receivedObj);
			if (formDataAttribute === "[data-form-elem]") {
				modalText.innerHTML = "Thank you. <br> Appointment sheduled.";
			} else {
				modalText.innerHTML = "Thank you. <br>  We will contact you shortly.";
			}
			modal.classList.add("active");
		}
	};	
}

function openMenu() {
	navigationMenu.classList.toggle("active-header-menu");
	burger.classList.toggle("is-active");
}

/*  Smooth scroll script */
const anchors = document.querySelectorAll('a[href*="#"]');
Array.from(anchors).forEach((anchor) => {
	anchor.addEventListener("click", function(e) {
		e.preventDefault();
		const blockID = anchor.getAttribute('href');
		document.querySelector('' + blockID).scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
	});
});

/* Button "UP" Script */
(function() {
	function trackScroll() {
		const scrolled = window.pageYOffset;
		const coords = document.documentElement.clientHeight;
	
		if (scrolled > coords) {
			goToTopButton.classList.add('active');
		} else {
			goToTopButton.classList.remove('active');
		}
	}
	window.addEventListener('scroll', trackScroll);
})();