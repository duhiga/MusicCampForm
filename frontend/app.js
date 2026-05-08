const { createApp } = Vue;
const vuetify = Vuetify.createVuetify();

createApp({
  data() {
    return {
      submitting: false,
      message: "",
      error: "",
      isFormValid: false,
      selectedCamperTab: 0,
      instruments: [
        "Bassoon",
        "Cello",
        "Clarinet",
        "Double Bass",
        "Flute",
        "Harp",
        "Horn",
        "Oboe",
        "Percussion",
        "Piano",
        "Trombone",
        "Trumpet",
        "Tuba",
        "Viola",
        "Violin",
        "None",
      ],
      groupPreferences: [
        "I am a relatively new beginner with this instrument (For children under 18 participating in Noisy Scrubs)",
        "Assign me to junior-high school level groups (approx AMEB 2-4)",
        "Assign me to senior-high school level groups (approx AMEB 5-6)",
        "Assign me to university level groups (approx AMEB 7+)",
        "Assign me to professional-level groups (Comfortable leading sections in Black orchestra and leading challenging chamber music repertoire)",
        "Don't assign me to groups at all (Non-players and young children)",
      ],
      additionalGroupPreferences: [
        "I am a relatively new beginner with this instrument (For children under 18 participating in Noisy Scrubs)",
        "Assign me to junior-high school level groups (approx AMEB 3-4)",
        "Assign me to senior-high school level groups (approx AMEB 5-6)",
        "Assign me to university level groups (approx AMEB 7+)",
        "Assign me to professional-level groups (Comfortable leading sections in Black orchestra and leading challenging chamber music repertoire)",
      ],
      activityOptions: ["Archery", "Canoeing", "Both", "None"],
      form: {
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
        payingOwnFees: "",
        payeeEmail: "",
        offsitePrice: "No",
        declarationAccepted: "No",
        partialAttendance: "",
        additionalInfo: "",
        children: [
          {
            email: "",
            firstName: "",
            lastName: "",
            phone: "",
            under18: "No",
            dob: "",
            parentContactName: "",
            parentContactEmail: "",
            parentAttending: "Yes",
            guardianName: "",
            guardianEmail: "",
            guardianOver25: "No",
            guardianRoomAcknowledged: "No",
            guardianDeclaration: "No",
            parentDeclaration: "No",
            preferredInstrument: "",
            preferredGroup: "",
            additionalInstrument1: "",
            additionalInstrument1Group: "",
            additionalInstrument2: "",
            additionalInstrument2Group: "",
            additionalInstrument3: "",
            additionalInstrument3Group: "",
            travelByBus: "",
            bringCaravanTent: "",
            specialNeeds: "",
            activityInterest: "",
            tutor: "No",
            playInAlbany: "No",
            concertoTitle: "",
            concertoComposer: "",
            chamberTitle: "",
            chamberInstruments: "",
          },
        ],
      },
    };
  },
  watch: {
    "form.email"(value) {
      if (this.form.children[0]) {
        this.form.children[0].email = value;
      }
    },
    "form.firstName"(value) {
      if (this.form.children[0]) {
        this.form.children[0].firstName = value;
      }
    },
    "form.lastName"(value) {
      if (this.form.children[0]) {
        this.form.children[0].lastName = value;
      }
    },
    "form.phone"(value) {
      if (this.form.children[0]) {
        this.form.children[0].phone = value;
      }
    },
  },
  methods: {
    requiredRule(value) {
      return !!value || "Required.";
    },
    emailRule(value) {
      if (!value) return "Required.";
      return /\S+@\S+\.\S+/.test(value) || "Enter a valid email.";
    },
    guardianOver25Rule(value) {
      return value === "Yes" || "Guardian must be over 25 years old.";
    },
    guardianRoomRule(value) {
      return value === "Yes" || "Guardian acknowledgement is required.";
    },
    payeeEmailRules(value) {
      if (this.form.payingOwnFees === "No") {
        if (!value) return "Required when someone else is paying.";
        return /\S+@\S+\.\S+/.test(value) || "Enter a valid email.";
      }
      return true;
    },
    newChild() {
      return {
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
        under18: "No",
        dob: "",
        parentContactName: "",
        parentContactEmail: "",
        parentAttending: "Yes",
        guardianName: "",
        guardianEmail: "",
        guardianOver25: "No",
        guardianRoomAcknowledged: "No",
        guardianDeclaration: "No",
        parentDeclaration: "No",
        preferredInstrument: "",
        preferredGroup: "",
        additionalInstrument1: "",
        additionalInstrument1Group: "",
        additionalInstrument2: "",
        additionalInstrument2Group: "",
        additionalInstrument3: "",
        additionalInstrument3Group: "",
        travelByBus: "",
        bringCaravanTent: "",
        specialNeeds: "",
        activityInterest: "",
        tutor: "No",
        playInAlbany: "No",
        concertoTitle: "",
        concertoComposer: "",
        chamberTitle: "",
        chamberInstruments: "",
      };
    },
    addCamper() {
      if (this.form.children.length < 4) {
        this.form.children.push(this.newChild());
        this.selectedCamperTab = this.form.children.length - 1;
      }
    },
    removeCamper(index) {
      if (index === 0) {
        return;
      }
      this.form.children.splice(index, 1);
      if (this.selectedCamperTab >= this.form.children.length) {
        this.selectedCamperTab = this.form.children.length - 1;
      }
    },
    validateChildren() {
      if (this.form.children.length === 0) {
        this.error = "Please add at least one camper.";
        return false;
      }
      for (let i = 0; i < this.form.children.length; i += 1) {
        const child = this.form.children[i];
        const requiredFields = [
          "email",
          "firstName",
          "lastName",
          "phone",
          "under18",
          "preferredInstrument",
          "preferredGroup",
          "travelByBus",
          "bringCaravanTent",
        ];
        for (const field of requiredFields) {
          if (!child[field]) {
            this.error = `Please complete all required fields for Camper ${i + 1}.`;
            return false;
          }
        }
        if (this.emailRule(child.email) !== true) {
          this.error = `Please enter a valid email address for Camper ${i + 1}.`;
          return false;
        }
        if (child.under18 === "Yes") {
          const under18Fields = ["dob", "parentContactName", "parentContactEmail", "parentAttending"];
          for (const field of under18Fields) {
            if (!child[field]) {
              this.error = `Please complete all required under-18 fields for Camper ${i + 1}.`;
              return false;
            }
          }
          if (this.emailRule(child.parentContactEmail) !== true) {
            this.error = `Please enter a valid parent contact email for Camper ${i + 1}.`;
            return false;
          }
          if (child.parentAttending === "No") {
            const guardianFields = [
              "guardianName",
              "guardianEmail",
              "guardianOver25",
              "guardianRoomAcknowledged",
              "guardianDeclaration",
              "parentDeclaration",
            ];
            for (const field of guardianFields) {
              if (!child[field]) {
                this.error = `Please complete all required guardian fields for Camper ${i + 1}.`;
                return false;
              }
            }
            if (this.emailRule(child.guardianEmail) !== true) {
              this.error = `Please enter a valid guardian email for Camper ${i + 1}.`;
              return false;
            }
          }
        }
      }
      return true;
    },
    validateSubmission() {
      this.error = "";
      const requiredFields = [
        "email",
        "firstName",
        "lastName",
        "phone",
        "payingOwnFees",
        "declarationAccepted",
      ];
      for (const field of requiredFields) {
        if (!this.form[field]) {
          this.error = "Please complete all required fields marked with *.";
          return false;
        }
      }
      const emailValidation = this.emailRule(this.form.email);
      if (emailValidation !== true) {
        this.error = "Please enter a valid email address.";
        return false;
      }
      if (this.form.payingOwnFees === "No" && !this.form.payeeEmail) {
        this.error = "Please provide the payee email address.";
        return false;
      }
      if (this.form.payeeEmail && this.emailRule(this.form.payeeEmail) !== true) {
        this.error = "Please enter a valid payee email address.";
        return false;
      }
      if (!this.validateChildren()) {
        return false;
      }
      if (this.form.declarationAccepted !== "Yes") {
        this.error = "Please accept the declaration before submitting.";
        return false;
      }
      return true;
    },
    async submitForm() {
      this.error = "";
      this.message = "";

      const formRef = this.$refs.applicationForm;
      const uiValid = formRef.validate();
      if (!uiValid) {
        this.error = "Please correct the highlighted errors before submitting.";
        return;
      }
      if (!this.validateSubmission()) {
        return;
      }

      this.submitting = true;
      try {
        const response = await fetch("/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.form),
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
          this.error = result.error || "Unable to submit the application. Please try again.";
        } else {
          this.message = "Your form has been submitted successfully. Thank you!";
          this.error = "";
          this.resetForm();
        }
      } catch (e) {
        this.error = "Submission failed. Please check your connection and try again.";
      } finally {
        this.submitting = false;
      }
    },
    resetForm() {
      this.form = {
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
        payingOwnFees: "",
        payeeEmail: "",
        offsitePrice: "No",
        declarationAccepted: "No",
        partialAttendance: "",
        additionalInfo: "",
        children: [
          {
            email: "",
            firstName: "",
            lastName: "",
            phone: "",
            under18: "No",
            dob: "",
            parentContactName: "",
            parentContactEmail: "",
            parentAttending: "Yes",
            guardianName: "",
            guardianEmail: "",
            guardianOver25: "No",
            guardianRoomAcknowledged: "No",
            guardianDeclaration: "No",
            parentDeclaration: "No",
            preferredInstrument: "",
            preferredGroup: "",
            additionalInstrument1: "",
            additionalInstrument1Group: "",
            additionalInstrument2: "",
            additionalInstrument2Group: "",
            additionalInstrument3: "",
            additionalInstrument3Group: "",
            travelByBus: "",
            bringCaravanTent: "",
            specialNeeds: "",
            activityInterest: "",
            tutor: "No",
            playInAlbany: "No",
            concertoTitle: "",
            concertoComposer: "",
            chamberTitle: "",
            chamberInstruments: "",
          },
        ],
      };
      this.selectedCamperTab = 0;
      if (this.$refs.applicationForm) {
        this.$refs.applicationForm.resetValidation();
      }
    },
  },
}).use(vuetify).mount("#app");
