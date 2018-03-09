<template>
  <page
        actionBarHidden="true">
    <GridLayout ref="formControls" class="form-controls" columns="auto,auto,auto" rows="auto,auto,auto,auto" translateY="50">
    
        <TextField columnSpan="1" col="2" hint="Phone Number" keyboardType="number" returnKeyType="next" v-model="user.numbers"  @returnPress="focusPassword()" :isEnabled="!isEnterEmail" autocorrect="false"
            autocapitalizationType="none" :hidden="!isEnterEmail" :class="{ light: !isEnterEmail}" row="0"></TextField>
    
        <Stacklayout columnSpan="1" col="1" row="0">
            <Switch v-model="isEnterEmail" checked="true" />
        </Stacklayout>
    
        <TextField columnSpan="1" hint="Email Address" keyboardType="email" returnKeyType="next" v-model="user.email" @returnPress="focusPassword()" :isEnabled="isEnterEmail" autocorrect="false" autocapitalizationType="none"
            row="0" col="0" :class="{ light: isEnterEmail}"  :hidden="!isEnterEmail" ></TextField>
    
        <TextField ref="password" columnSpan="1" col="1" hint="Password" secure="true" returnKeyType="done" v-model="user.password" @returnPress="submit()" :isEnabled="!isAuthenticating" :class="{ light: !isLoading }" row="1"></TextField>
    
        <!-- login / sign up button -->
    
        <StackLayout row="3" col="0" columnSpan="3">
            <label>{{ isEnterEmail }}</label>        <Button col="1" columnSpan="1" row="2" text="Login" :isEnabled="!isLoading" class="submit-button" @tap="submit()"></Button>

        </StackLayout>

        <ActivityIndicator :busy="isLoading" rowSpan="2"></ActivityIndicator>
    </GridLayout>
    </page>
</template>

<script>
    import dialogs from 'ui/dialogs'
    export default {
        name: 'login',
        data() {
            return {
                isLoading: false,
                isEnterEmail: false,
                user: {
                    numbers: "",
                    password: "",
                    email: ""
                }
            }
        },
        mounted() {

        },
        methods: {
            submit() {
                this.isLoading = true;
                dialogs.alert("Submitting - " + this.user.numbers + " ,,,, " + this.user.password).then(() => {
                    console.log("Sent");
                });
            }
        }
    }
</script>

<style>
    
</style>