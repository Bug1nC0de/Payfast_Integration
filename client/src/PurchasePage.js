import React, { useState } from "react";
import { Row, Form, Button, Card, InputGroup } from "react-bootstrap";

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

	return (
		<div>
			<Row className="justify-content-center">
				<Card style={{ border: "0px", width: "25rem" }}>
					<Form
						action="https://sandbox.payfast.co.za​/eng/process"
						method="post"
					>
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
							<Button variant="success" block type="submit">
								Your total is R{total} Click to Pay{" "}
								<i className="fas fa-credit-card ml-2"></i>
							</Button>
						)}
					</Form>
				</Card>
			</Row>
		</div>
	);
};

export default PurchasPage;
