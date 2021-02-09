import React, { useState } from "react";
import { Row, Form, Button, Card, InputGroup } from "react-bootstrap";
import axios from "axios";
import crypto from "crypto";

const PurchasPage = () => {
	const [quantity, setQuantity] = useState(0);
	const [total, setTotal] = useState(0);

	const calculateTotal = () => {
		if (quantity <= 0) {
			setTotal(0);
			console.log("Stop playing Games");
		} else {
			let amount = quantity * 20;
			setTotal(amount);
		}
	};

	//Payfast API Function//
	//The function to post to the payfast API
	//HANDLE THE PAYMENT SUCCESSFULL
	//HANDLE PAYMENT CANCELLED
	//HANDLE PAYMENT FAILURE
	//Must be HERE//
	const paymentSuccess = () => console.log("PAYMENT SUCCESS");
	const paymentCancelled = () => console.log("PAYMENT CANCELLED");

	const initiatePayment = async () => {
		const myData = {
			merchant_id: "10798473",
			merchant_key: "qtbv3djb4afpj",
			email_address: "sample_mail@gmail.com",
			amount: total.toString(),
			item_name: "test",
		};
		const generateSignature = (data, passPhrase = null) => {
			// Create parameter string
			let pfOutput = "";
			for (let key in data) {
				if (data.hasOwnProperty(key)) {
					if (data[key] !== "") {
						console.log(data[key]);
						pfOutput += `${key}=${encodeURIComponent(data[key].trim()).replace(
							/%20/g,
							" + "
						)}&`;
					}
				}
			}

			// Remove last ampersand
			let getString = pfOutput.slice(0, -1);
			if (passPhrase !== null) {
				getString += `&passphrase=${encodeURIComponent(
					passPhrase.trim()
				).replace(/%20/g, "+")}`;
			}

			return crypto.createHash("md5").update(getString).digest("hex");
		};
		const dataToString = (dataArray) => {
			// Convert your data array to a string
			let pfParamString = "";
			for (let key in dataArray) {
				if (dataArray.hasOwnProperty(key)) {
					pfParamString += `${key}=${encodeURIComponent(
						dataArray[key].trim()
					).replace(/%20/g, "+")}&`;
				}
			}
			// Remove last ampersand
			return pfParamString.slice(0, -1);
		};

		const generatePaymentIdentifier = async (pfParamString) => {
			const result = await axios
				.post(`https://www.payfast.co.za/onsite/process`, pfParamString,{crossDomain:true})
				.then((res) => {
					return res.data.uuid || null;
				})
				.catch((error) => {
					console.error(error);
				});
			console.log("res.data", result);
			return result;
		};

		// Generate signature (see Custom Integration -> Step 2)
		myData["signature"] = generateSignature(myData);

		// Convert the data array to a string
		const pfParamString = dataToString(myData);

		// Generate payment identifier
		const identifier = await generatePaymentIdentifier(pfParamString);

		window.payfast_do_onsite_payment({ uuid: identifier }, function (result) {
			if (result === true) {
				// Payment Completed
				paymentSuccess();
			} else {
				// Payment Window Closed
				paymentCancelled();
			}
		});
	};

	return (
		<div>
			<Row className="justify-content-center">
				<Card style={{ border: "0px", width: "25rem" }}>
					{/*<Form*/}
					{/*	action="https://payfast.co.za/eng/process" method="post"*/}
					{/*>*/}

					<Card.Header className="bg-dark text-white mb-2">
						Purchase ITEM
					</Card.Header>
					<Form.Group>
						How many ITEMS would you like to purchase?
						<InputGroup>
							<Form.Control
								required
								type="number"
								min="0"
								value={quantity}
								onChange={(e) => setQuantity(e.target.value)}
							/>
							<InputGroup.Append>
								<Button onClick={calculateTotal}>
									Confirm <i className="far fa-check-circle"></i>
								</Button>
							</InputGroup.Append>
						</InputGroup>
					</Form.Group>

					{total <= 0 ? (
						<Button variant="outline-info text-success" block disabled>
							Total R{total}, Confirm number of tunnels to pay{" "}
							<i className="fas fa-credit-card ml-2"></i>
						</Button>
					) : (
						<Button
							variant="success"
							block
							type="submit"
							onClick={initiatePayment}
						>
							Your total is R{total} Click to Pay{" "}
							<i className="fas fa-credit-card ml-2"></i>
						</Button>
					)}
					{/*</Form>*/}
				</Card>
			</Row>
		</div>
	);
};

export default PurchasPage;
