<template>
  <page actionBarHidden="true">
    <StackLayout>
      <GridLayout v-show="isLoading" rows="*" columns="*">
        <ActivityIndicator verticalAlignment="center" textAlignment="center" v-show="isLoading" :busy="isLoading"></ActivityIndicator>
      </GridLayout>
      <GridLayout ref="transactionScreen" backgroundColor="white" v-if="transaction" v-show="!isLoading" rows="auto,auto,*" columns="*">
        <CardView row="0" elevation="15">
          <GridLayout columns="auto,*,auto" class="bg-dark-blue p-10">
            <Ripple @tap="navigate(null)" verticalAlignment="center" borderRadius="50%">
              <Label verticalAlignment="center" textAlignment="center" class="mdi text-white p-5" fontSize="25%" :text="'mdi-arrow-left' | fonticon"></Label>
            </Ripple>
            <label class="p-x-15 text-white" verticalAlignment="center" fontSize="18%" col="1" text="Transaction detail"></label>
            <Ripple v-if="transaction" col="2" @tap="shareImage(transaction)" verticalAlignment="center" borderRadius="50%">
              <Label verticalAlignment="center" textAlignment="center" class="mdi text-white p-5" fontSize="25%" :text="'mdi-share-variant' | fonticon"></Label>
            </Ripple>
          </GridLayout>
        </CardView>
        <StackLayout v-if="transaction" class="m-15" row="1">
          <GridLayout rows="auto,auto,auto,auto,auto,auto,auto,auto" columns="*,auto">
            <label class="p-b-5" row="0" col="0" text="Date"></label>
            <label class="p-b-5" row="0" col="1" :text="getMoment(transaction.date).format('dddd , DD MMMM YYYY , HH:mm')"></label>
            <label class="p-b-5" row="1" col="0" text="Type"></label>
            <label class="p-b-5" row="1" col="1" :text="transaction.type == 'MONEYIN' ? 'Deposit' : 'Withdraw'"></label>
            <label class="p-b-5" row="2" col="0" text="Category"></label>
            <label class="p-b-5" row="2" col="1" :text="transaction.category"></label>
            <label class="p-b-5" row="3" col="0" text="Amount"></label>
            <label class="p-b-5" row="3" col="1" :text="`R${transaction.amount}`"></label>
            <label class="p-b-5" v-if="transaction.description" row="4" col="0" text="Description"></label>
            <label class="p-b-5" v-if="transaction.description" :textWrap="true" row="4" col="1" :text="transaction.description"></label>
            <label class="p-b-5" row="5" col="0" text="Uploaded by"></label>
            <label class="p-b-5" row="5" col="1" :text="transaction.adminID.userName"></label>
            <label class="p-b-5" v-if="transaction.client" row="6" col="0" text="From"></label>
            <label class="p-b-5" v-if="transaction.client" row="6" col="1" :text="transaction.client.userName"></label>
            <label class="p-b-5" v-if="transaction.monthOfPayment" row="7" col="0" text="Month"></label>
            <label class="p-b-5" v-if="transaction.monthOfPayment" row="7" col="1" :text="transaction.monthOfPayment"></label>
          </GridLayout>
        </StackLayout>
        <label v-if="!transaction" row="2" verticalAlignment="center" textAlignment="center" text="Invalid transaction selected."></label>
        <label v-if="transaction && !transaction.proof" row="2" verticalAlignment="center" textAlignment="center" text="No image"></label>
        <StackLayout @pan="onPan($event)" @doubleTap="onDoubleTap(event)" @pinch="onPinch($event)" v-if="transaction && transaction.proof" row="2" verticalAlignment="center" textAlignment="center">
         <Image :style="zoomLevel" :src="transaction.proof" stretch="aspectFill"></Image>
        </StackLayout>
      </GridLayout>
    </StackLayout>
  </page>
</template>

<script>
import * as SocialShare from "nativescript-social-share";
import * as imageSource from "tns-core-modules/image-source";
import * as image from "ui/image";
var plugin = require("nativescript-screenshot");

export default {
  name: "Transaction",
  data() {
    return {
      transaction: null,
      isLoading: false,
      zoomLevel: {
        transform: "scale(1) translate(0, 0)"
      },
      x: 0,
      y: 0,
      z: 1
    };
  },
  mounted() {
    if (this.transactionID) {
      this.LoadTransaction();
    }
  },
  props: ["transactionID"],
  methods: {
    LoadTransaction() {
      this.isLoading = true;
      this.$api
        .getTransaction(this.transactionID)
        .then(t => {
          this.transaction = t;
          this.isLoading = false;
        })
        .catch(err => {
          this.$feedback.error({
            title: "Transaction can not be retrieved",
            duration: 4000,
            message: "Please try again later."
          });
          this.isLoading = false;
        });
    },
    onDoubleTap(args) {
      if (this.z > 1) {
        this.x = 0;
        this.y = 0;
        this.onZoomOut(1);
      } else {
        this.onZoomIn(4);
      }
    },
    onZoomIn(value) {
      this.z = value;
      this.zoomLevel.transform = `scale(${this.z}) translate(${this.x}, ${
        this.y
      })`;
    },
    onZoomOut(value) {
      this.z = value;
      if (this.z > 1) this.z--;
      this.zoomLevel.transform = `scale(${this.z}) translate(${this.x}, ${
        this.y
      })`;
    },
    onPinch(args) {
      var value = this.z;
      if (args.scale > 1) {
        value += args.scale / 10;
        this.onZoomIn(value);
      } else if (args.scale < 1) {
        value -= args.scale;
        if (value > 2) {
          this.onZoomOut(value);
        }
      }
    },
    onPan(args) {
      if (args.deltaX > this.x) {
        this.x += 5;
      } else {
        this.x -= 5;
      }

      if (args.deltaY > this.y) {
        this.y += 5;
      } else {
        this.y -= 5;
      }
      this.zoomLevel.transform = `scale(${this.z}) translate(${this.x}, ${
        this.y
      })`;
    },
    shareImage(transaction) {
      if (transaction.proof) {
        confirm({
          title: "Share or save transaction",
          message: "What do you want to share from this transaction?",
          okButtonText: "Just the proof",
          cancelButtonText: "Everything"
        })
          .then(result => {
            var image = null;
            if (result) {
              image = imageSource.fromBase64(
                transaction.proof.replace("data:image/png;base64,", "")
              );
            } else {
              image = plugin.getImage(this.$refs.transactionScreen.nativeView);
            }
            if (image) {
              SocialShare.shareImage(
                image,
                "How would you like to share your transaction?"
              );
            } else {
              throw "Unable to generate a shareable image.";
            }
          })
          .catch(err => {
            this.$feedback.error({
              title: "Unable to share",
              message: err.message
            });
          });
      } else {
        var image = plugin.getImage(this.$refs.transactionScreen.nativeView);
        if (image) {
          SocialShare.shareImage(
            image,
            "How would you like to share your transaction?"
          );
        } else {
          this.$feedback.error({
            title: "Unable to share",
            message: "Unable to generate a shareable image."
          });
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>