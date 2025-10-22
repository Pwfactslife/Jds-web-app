export default {
    submitAllFiles: async () => {
        try {
            // 1) Photo (Widget name: Upload_Photo)
            if (Upload_Photo.files.length === 0) { 
                throw new Error("Please upload a Profile Photo.");
            }
            const photo = await Photo.run();
            if (photo.status !== "success") {
                throw new Error("Photo: " + (photo.message || "upload failed"));
            }

            // 2) Aadhaar Front (Widget name: Upload_Aadhaar_Front)
            if (Upload_Aadhaar_Front.files.length === 0) { 
                throw new Error("Please upload Aadhaar Front.");
            }
            const aaf = await upload_Aadhaar_Front.run();
            if (aaf.status !== "success") {
                throw new Error("Aadhaar Front: " + (aaf.message || "upload failed"));
            }

            // 3) Aadhaar Back (Widget name: Upload_Aadhaar_Back)
            if (Upload_Aadhaar_Back.files.length === 0) { 
                throw new Error("Please upload Aadhaar Back.");
            }
            const aab = await upload_Aadhaar_Back.run();
            if (aab.status !== "success") {
                throw new Error("Aadhaar Back: " + (aab.message || "upload failed"));
            }

            // 4) PAN (Widget name: Upload_Your_Pan)
            if (Upload_Your_Pan.files.length === 0) { 
                throw new Error("Please upload PAN Card.");
            }
            const pan = await upload_Pan.run();
            if (pan.status !== "success") {
                throw new Error("PAN: " + (pan.message || "upload failed"));
            }

            // 5) Other (Widget name: Others_File - Optional)
            let oth = { status: "success", fileUrl: "" }; 
            if (Others_File.files.length > 0) { 
                oth = await upload_Other_File.run();
                if (oth.status !== "success") {
                    throw new Error("Other File: " + (oth.message || "upload failed"));
                }
            }

            // 6) Insert into Sheet
            await Add_Personnel.run(); 

            // 7) Success!
            showAlert("Personnel added successfully!", "success");
            closeModal('Modal1'); 

        } catch (error) {
            console.log("Submit error:", error);
            showAlert(String(error.message || error), "error");
        }
    }
}