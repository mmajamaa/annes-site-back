const sinon = require("sinon");
const chai = require("chai");
const expect = chai.expect;

const ImageController = require("../controllers/image-controller")
const Image = require("../models/images");

describe("ImageController", () => {
    describe("GET images route", () => {
        afterEach(() => {
            sinon.restore();
        })
    
        it("should get all the images", async () => {
            const fakeModel = {
                sort: function(args) {
                    return this
                },
                populate: function(args) {
                    return ["myImg"]
                }
            }

            sinon.stub(Image, "find").returns(fakeModel);
            
            const res = {
                images: [],
                resCode: undefined,
                json: function(images) {
                    this.images = images;
                    return this
                },
                status: function (res) {
                    this.resCode = res;
                    return this;
                }
            }
            
            await ImageController.getImages({}, res, {});
    
            expect(res.images[0]).to.be.equal("myImg");
            expect(res.resCode).to.be.equal(200);
        });

        it("res obj's fields should have correct values if getting the images fails", () => {
            sinon.stub(Image, "find").throws();

            const res = {
                message: "",
                resCode: undefined,
                json: function(message) {
                    this.message = message.message;
                    return this
                },
                status: function (res) {
                    this.resCode = res;
                    return this;
                }
            }
            
            ImageController.getImages({}, res, {});
    
            expect(res.resCode).to.equal(501);
            expect(res.message).to.equal("Error getting images")
        });
    });
}) 