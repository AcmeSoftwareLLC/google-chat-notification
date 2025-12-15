import { context } from "@actions/github";

function getImageUrl(platform: string): string {
	return `https://raw.githubusercontent.com/AcmeSoftwareLLC/google-chat-notification/refs/heads/main/platforms/${platform.toLowerCase()}.png`;
}

function getWorkflowUrl(): string {
	const { owner, repo } = context.repo;

	return `https://github.com/${owner}/${repo}/actions/runs/${context.runId}`;
}

function getDecoratedText(
	iconName: string,
	label: string,
	value: string,
	fillIcon: boolean = true,
): object {
	return {
		decoratedText: {
			startIcon: { materialIcon: { name: iconName, fill: fillIcon } },
			topLabel: label,
			text: value,
		},
	};
}

function getDivider(): object {
	return { divider: {} };
}

export { getImageUrl, getWorkflowUrl, getDecoratedText, getDivider };
