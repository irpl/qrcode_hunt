<template>
  <!-- <div> -->
  <!-- <div class="main"></div> -->
  <div class="main">
        <div class="card card-container">
          <h3>This is sooo</h3>
          <h1>CLUTCH</h1>
          <div class="logo"></div>
            <form class="form-signin">
                <router-link to="/quest" tag="button" class="btn btn-lg" type="submit">New game</router-link>
                <router-link to="/quest" tag="button" class="btn btn-lg" type="submit">Continue</router-link>
            </form> 
        </div>
    </div>
    <!-- </div> -->
</template>

<script>
export default {
  name: "Home"
}
</script>

<style scoped>

.main {
  text-align: center;
}

.logo{
  height: 40px;
}

.card-container.card {
    max-width: 300px;
    padding: 40px 40px;
}
.card {
    background-color: #F7F7F722;
    /* just in case there no content*/
    padding: 20px 25px 30px;
    margin: 0 auto 25px;
    margin-top: 100px;
    /* shadows and rounded borders */
    -moz-border-radius: 2px;
    -webkit-border-radius: 2px;
    border-radius: 2px;
    -moz-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
    -webkit-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
}
</style>
