import React, { useState } from "react";

import styles from "./Tutor.module.css";

function Tutor({ challenge, points }) {
	const [showHint, setShowHint] = useState(false);
	const [isRangeExpanded, setIsRangeExpanded] = useState(true);
	const [isInstructionsExpanded, setIsInstructionsExpanded] = useState(true);

	const getHint = () => {
		if (!challenge || !points) return "";

		const yValues = points.map((p) => p.y);
		const currentMin = Math.min(...yValues);
		const currentMax = Math.max(...yValues);
		const currentRange = currentMax - currentMin;

		const { type, value, min, max } = challenge;

		if (type === "less_than") {
			if (currentRange >= value) {
				return `Your range is ${currentRange}, but you need less than ${value}. Try moving some points closer together on the y-axis.`;
			}
			return `Great! Your range is ${currentRange}, which is less than ${value}. You're on the right track!`;
		} else if (type === "greater_than") {
			if (currentRange <= value) {
				return `Your range is ${currentRange}, but you need greater than ${value}. Try moving points further apart on the y-axis.`;
			}
			return `Perfect! Your range is ${currentRange}, which is greater than ${value}. Well done!`;
		} else if (type === "between") {
			if (currentRange < min) {
				return `Your range is ${currentRange}, but you need between ${min} and ${max}. Move points further apart.`;
			} else if (currentRange > max) {
				return `Your range is ${currentRange}, but you need between ${min} and ${max}. Move points closer together.`;
			}
			return `Excellent! Your range is ${currentRange}, which is between ${min} and ${max}.`;
		} else if (type === "exact") {
			const targetMin = min;
			const targetMax = max;
			if (currentMin < targetMin - 10) {
				return `Your minimum is ${currentMin}, but you need ${targetMin}. Move the lowest point up.`;
			} else if (currentMin > targetMin + 10) {
				return `Your minimum is ${currentMin}, but you need ${targetMin}. Move the lowest point down.`;
			} else if (currentMax < targetMax - 10) {
				return `Your maximum is ${currentMax}, but you need ${targetMax}. Move the highest point up.`;
			} else if (currentMax > targetMax + 10) {
				return `Your maximum is ${currentMax}, but you need ${targetMax}. Move the highest point down.`;
			}
			return `Almost there! Adjust the points to get exactly min=${targetMin} and max=${targetMax}.`;
		}

		return "Try adjusting the points on the y-axis to achieve the target range.";
	};

	return (
		<div className={styles.tutor}>
			<div className={styles["tutor-section"]}>
				<div className={styles["section-header"]}>
					<h2>📚 What is Range?</h2>
					<button
						className={styles["collapse-button"]}
						onClick={() => setIsRangeExpanded(!isRangeExpanded)}
						aria-label={isRangeExpanded ? "Collapse section" : "Expand section"}
					>
						{isRangeExpanded ? "✕" : "+"}
					</button>
				</div>
				{isRangeExpanded && (
					<p className={styles.definition}>
						<strong>Range</strong> is the set of possible output values,
						which are shown on the y-axis. It represents the difference
						between the highest and lowest values in your data.{" "}
						<a
							href="https://courses.lumenlearning.com/waymakercollegealgebra/chapter/find-domain-and-range-from-a-graph/"
							target="_blank"
							rel="noopener noreferrer"
						>
							Learn more about domain and range from graphs
						</a>
					</p>
				)}
			</div>

			{challenge && (
				<div
					className={`${styles["tutor-section"]} ${styles["challenge-section"]}`}
				>
					<h2>🎯 Your Challenge</h2>
					<p className={styles["challenge-text"]}>
						{challenge.description}
					</p>
					<div className={styles["challenge-details"]}>
						{challenge.type === "less_than" && (
							<span>Target: Range &lt; {challenge.value}</span>
						)}
						{challenge.type === "greater_than" && (
							<span>Target: Range &gt; {challenge.value}</span>
						)}
						{challenge.type === "between" && (
							<span>
								Target: Range between {challenge.min} and{" "}
								{challenge.max}
							</span>
						)}
						{challenge.type === "exact" && (
							<span>
								Target: Range from {challenge.min} to{" "}
								{challenge.max}
							</span>
						)}
					</div>

					<button
						onClick={() => setShowHint(!showHint)}
						style={{
							marginTop: "10px",
							padding: "8px 16px",
							background: "#667eea",
							color: "white",
							border: "none",
							borderRadius: "6px",
							cursor: "pointer",
							fontSize: "14px",
						}}
					>
						{showHint ? "Hide Hint" : "💡 Show Hint"}
					</button>

					{showHint && (
						<div
							style={{
								marginTop: "10px",
								padding: "12px",
								background: "#fff3cd",
								border: "1px solid #ffc107",
								borderRadius: "6px",
								fontSize: "14px",
							}}
						>
							{getHint()}
						</div>
					)}
				</div>
			)}

			<div
				className={`${styles["tutor-section"]} ${styles.instructions}`}
			>
				<div className={styles["section-header"]}>
					<h2>💡 Instructions</h2>
					<button
						className={styles["collapse-button"]}
						onClick={() => setIsInstructionsExpanded(!isInstructionsExpanded)}
						aria-label={isInstructionsExpanded ? "Collapse section" : "Expand section"}
					>
						{isInstructionsExpanded ? "✕" : "+"}
					</button>
				</div>
				{isInstructionsExpanded && (
					<ul>
						<li>
							Click and drag the bubbles to move them along the y-axis
							(or x-axis)
						</li>
						<li>Adjust the points to achieve the target range</li>
						<li>Click "Submit Answer" to check if you're correct</li>
						<li>
							The range is calculated from the minimum to maximum
							y-values
						</li>
					</ul>
				)}
			</div>
		</div>
	);
}

export default Tutor;
