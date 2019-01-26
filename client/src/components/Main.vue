<template>
  <!-- <div> -->
  <!-- <div class="main"></div> -->
  <div class="main">
        <div class="card card-container">
          <h3>This is sooo</h3>
          <h1>CLUTCH</h1>
          <div class="logo"></div>
            <form class="form-signin">
                <button class="btn btn-lg btn-primary btn-block btn-signin" type="submit">New game</button>
                <button class="btn btn-lg btn-primary btn-block btn-signin" type="submit">Continue</button>
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

.btn {
  color: inherit;
  font-weight: 700;
  height: 72px;
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
  cursor: default;
}

/*
 * Card component
 */
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

.form-signin button {
    width: 100%;
    display: block;
    margin-bottom: 10px;
    z-index: 1;
    position: relative;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}

.btn {
    background-color: #2a2826;
    padding: 0px;
    font-family: Raleway;
    font-weight: 700;
    font-size: 20px;
    /* height: 36px; */
    -moz-border-radius: 3px;
    -webkit-border-radius: 3px;
    border-radius: 3px;
    border: none;
    -o-transition: all 0.218s;
    -moz-transition: all 0.218s;
    -webkit-transition: all 0.218s;
    transition: all 0.218s;
}

.btn.btn-signin:hover,
.btn.btn-signin:active,
.btn.btn-signin:focus {
    background-color: #7c7671;
}


</style>
