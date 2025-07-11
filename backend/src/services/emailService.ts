import { Resend } from "resend";

export const sendOrderConfirmationEmail = async (to: string, subject: string, htmlContent: string) => {
    const resend = new Resend(process.env.RESEND_API_KEY);
	try {
		const { data, error } = await resend.emails.send({
			from: "onboarding@resend.dev", // This should be a verified domain in Resend
			to: to,
			subject: subject,
			html: htmlContent,
		});

		if (error) {
			console.error("Error sending email:", error);
			return { success: false, error };
		}

		console.log("Email sent successfully:", data);
		return { success: true, data };
	} catch (error) {
		console.error("Unexpected error sending email:", error);
		return { success: false, error };
	}
};
