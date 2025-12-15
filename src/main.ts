import { getInput, setFailed, setOutput } from "@actions/core";
import { context } from "@actions/github";
import { HttpClient, type HttpClientResponse } from "@actions/http-client";
import {
	getDecoratedText,
	getDivider,
	getImageUrl,
	getWorkflowUrl,
} from "./utils.js";

export async function run(): Promise<void> {
	try {
		const webhookUrl = getInput("webhook-url", { required: true });
		const mention = getInput("mention") || "<users/all>";
		const platform = getInput("platform", { required: true });
		const appVersion = getInput("app-version", { required: true });
		const buildNumber = getInput("build-number") || "N/A";
		const changelog = getInput("changelog", { required: true });
		const status = getInput("status")?.toLowerCase() || "success";
		const imageUrl = getInput("image-url") || getImageUrl(platform);

		const message =
			status === "success"
				? `🚀 ${mention} New ${platform} Build Available!`
				: status === "canceled"
					? `⚠️ ${platform} Build Canceled!`
					: `❌ ${platform} Build Failed!`;

		const client = new HttpClient("google-chat-build-notification-action");
		const content = {
			text: message,
			cards_v2: [
				{
					card: {
						header: {
							title: `${platform} Build`,
							subtitle: `triggered by ${context.actor}`,
							imageUrl: imageUrl,
						},
						sections: [
							{
								widgets: [
									getDecoratedText("info", "App Version", appVersion),
									getDecoratedText("settings", "Build Number", buildNumber),
									getDecoratedText("storage", "Repository", context.repo.repo),
									getDivider(),
									{
										textParagraph: { text: changelog, text_syntax: "MARKDOWN" },
									},
									getDivider(),
									{
										buttonList: {
											buttons: [
												{
													text: "View Workflow Run",
													type: "FILLED_TONAL",
													icon: { material_icon: { name: "automation" } },
													on_click: {
														open_link: { url: getWorkflowUrl() },
													},
												},
											],
										},
									},
								],
							},
						],
					},
				},
			],
		};

		const response: HttpClientResponse = await client.post(
			webhookUrl,
			JSON.stringify(content),
			{
				"Content-Type": "application/json",
			},
		);

		const statusCode = response.message.statusCode;

		if (statusCode && statusCode >= 400) {
			const body = await response.readBody();

			if (body) {
				const parsedBody = JSON.parse(body);
				const message = parsedBody.error?.message;

				if (message) {
					setFailed(
						`Failed to send notification. Status Code: ${statusCode}. Message: ${message}`,
					);
					process.exit(1);
				}
			}

			setFailed(`Failed to send notification. Status Code: ${statusCode}`);
			process.exit(1);
		}

		setOutput("status-code", statusCode || 200);
		process.exit(0);
	} catch (error) {
		setFailed(error instanceof Error ? error.message : String(error));
		process.exit(1);
	}
}
