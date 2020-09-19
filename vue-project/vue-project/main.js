Vue.config.devtools = true;
Vue.component('product', {
  props: {
    premium: {
      type: Boolean,
      required: true,
    },
  },
  template: `   <div class="product">
  <div class="product-image">
    <img :src="image" :alt="altText" />
  </div>
  <div class="product-info">
    <h1>{{title}}</h1>
    <p>{{description}}</p>
    <p v-if="inStock">In Stock</p>
    <p v-else>Out of Stock</p>
    <p> Shipping: {{shipping}} </p>
    <ul>
      <li v-for="detail in details">{{ detail }}</li>
    </ul>
    <div
      class="color-box"
      v-for="(variant, index) in variants"
      :key=" variant.variantID "
      :style=" { backgroundColor: variant.variantColor }"
      @mouseover="updateProduct(index)"
    ></div>
    <button
      :class="{ disabledButton: !inStock }"
      :disabled="!inStock"
      @click="addToCart"
    >
      Add to cart
    </button>


  </div>
  <product-tabs> </product-tabs>
  <div>
  <p v-if="!reviews.length">There are no reviews yet.</p>
  <ul>
    <li v-for="review in reviews">
      <p>{{ review.name }}</p>
      <p>{{ review.review }}</p>
      <p>{{ review.rating }}</p>
    </li>
  </ul>
</div>

  <product-review @review-submitted="addReview"></product-review>
</div>
`,
  data() {
    return {
      brand: 'Vue Mastery',
      product: 'Socks',
      description: 'A pair of warm, fuzzy socks',
      selectedVariant: 0,
      altText: ' A pair of green socks',
      details: ['80% cotton', '20% polyester', 'Gender-neutral'],
      variants: [
        {
          variantID: 2234,
          variantColor: 'green',
          variantImage: './assets/socks-green.jpg',
          variantQuantity: 10,
        },
        {
          variantID: 2235,
          variantColor: 'blue',
          variantImage: './assets/socks-blue.jpg',
          variantQuantity: 0,
        },
      ],
      reviews: [],
    };
  },
  methods: {
    addToCart() {
      this.$emit('add-to-cart');
    },
    updateProduct(index) {
      this.selectedVariant = index;
    },
    addReview(productReview) {
      this.reviews.push(productReview);
    },
  },
  computed: {
    title() {
      return this.brand + ' ' + this.product;
    },
    image() {
      return this.variants[this.selectedVariant].variantImage;
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity;
    },
    shipping() {
      if (this.premium) return 'Free';
      else return 2.99;
    },
  },
});

Vue.component('product-review', {
  template: `
  <form class="review-form" @submit.prevent="onSubmit">
  <p v-if="errors.length">
  <b>Please correct the following error(s):</b>
  <ul>
    <li v-for="error in errors">{{ error }}</li>
  </ul>
</p>
  <p>
    <label for="name">Name:</label>
    <input id="name" v-model="name" placeholder="name">
  </p>
  
  <p>
    <label for="review">Review:</label>      
    <textarea id="review" v-model="review"></textarea>
  </p>
  
  <p>
    <label for="rating">Rating:</label>
    <select id="rating" v-model.number="rating">
      <option>5</option>
      <option>4</option>
      <option>3</option>
      <option>2</option>
      <option>1</option>
    </select>
  </p>
      
  <p>
    <input type="submit" value="Submit">  
  </p>    

</form>
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      errors: [],
    };
  },
  methods: {
    onSubmit() {
      if (this.name && this.review && this.rating) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
        };
        this.$emit('review-submitted', productReview),
          (this.name = null),
          (this.review = null),
          (this.rating = null);
      } else {
        if (!this.name) this.errors.push('Name required');
        if (!this.review) this.errors.push('Review required');
        if (!this.rating) this.errors.push('Rating required');
      }
    },
  },
});

Vue.component('product-tabs', {
  props: {
    reviews: {
      type: Array,
      required: false,
    },
  },
  template: `
    <div>    
      <ul>
        <span class="tab" 
        :class="{ activeTab : selectedTab == tab}"
              v-for="(tab, index) in tabs" 
              @click="selectedTab = tab"
        >{{ tab }}</span>
      </ul> 
    </div>
  `,
  data() {
    return {
      tabs: ['Reviews', 'Make a Review'],
      selectedTab: 'Reviews',
    };
  },
});

var app = new Vue({
  el: '#app',
  data: {
    premium: true,
    cart: [],
  },
  methods: {
    updateCart(id) {
      this.cart.push(id);
    },
  },
});
