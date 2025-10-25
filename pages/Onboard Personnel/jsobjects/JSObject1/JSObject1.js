export default {
  submitAllFiles: async () => {
    try {
      // --- File Upload Checks ---
      if (Upload_Photo.files.length === 0) throw new Error("Please upload a Profile Photo.");
      if (Upload_Aadhaar_Front.files.length === 0) throw new Error("Please upload Aadhaar Front.");
      if (Upload_Aadhaar_Back.files.length === 0) throw new Error("Please upload Aadhaar Back.");
      if (Upload_Your_Pan.files.length === 0) throw new Error("Please upload PAN Card.");

      // --- Upload Files and Store Results ---
      const photo = await upload_Photo_B2.run();
      const aaf = await upload_Aadhaar_Front_B2.run();
      const aab = await upload_Aadhaar_Back_B2.run();
      const pan = await upload_Pan_B2.run();
      
      let oth = { url: "" }; // Default for optional file
      if (Others_File.files.length > 0) {
        oth = await upload_Other_File_B2.run();
      }

      // --- Check if URLs Exist in Results (Optional but good practice) ---
      if (!photo?.url || !aaf?.url || !aab?.url || !pan?.url) {
         console.error("One or more required URLs are missing!", { photo, aaf, aab, pan });
         throw new Error("Could not retrieve required file URLs after upload.");
      }

      // --- Prepare Payload Object for Google Sheet ---
      const payload = {
        "Full_Name": Full_Name.text,
        "Fathers_Name": Fathers_Name.text, // Assuming sheet column is Fathers_Name
        "DOB": DOB.selectedDate,
        "Primary_Mobile_Number": Primary_Mobile_Number.text,
        "Secondary_Mobile_Number": Secondary_Mobile_Number.text,
        "Aadhar_Number": Aadhar_Number.text,
        "Pan_Number": Pan_Number.text,
        "Role": Select_Role.selectedOptionValue,
        "Primary_Unit_Code": Assign_Unit.selectedOptionValue,
        "Area": Area.text,
        "Status": "Active",
        "Date_Of_Joining": new Date().toISOString(),
        "Profile_Photo_URL": photo.url, // Get URL from variable
        "Aadhar_Photo_URL": aaf.url,   // Get URL from variable
        "Aadhar_Back_URL": aab.url,   // Get URL from variable
        "Pan_Photo_URL": pan.url,     // Get URL from variable
        "Other_Documents_URL": oth.url, // Get URL from variable (will be "" if no file)
        "Employee_ID": ""
      };
      
      console.log("Payload to send:", payload); // Log the payload

      // --- Insert Data into Google Sheet ---
      // Pass the payload object to the query
      await Add_Personnel.run(payload); 
      
      // --- Show Success ---
      showAlert("Personnel added successfully!", "success");
			// !! ADD THIS LINE !!
      // Replace 'Modal1' with the actual name of your modal widget
      resetWidget("Modal1", true); 
      
      // Now close the modal
      closeModal('Modal1'); 

    } catch (error) {
      console.error("Submit error:", error); 
      showAlert(String(error.message || error), "error");
    }
  }
}