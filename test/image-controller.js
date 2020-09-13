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
    
        it("should get all the images", () => {
            sinon.stub(Image, "find").returns([undefined]);
            const res = {
                images: [],
                resCode: "",
                json: function(images) {
                    this.images = images;
                    return this
                },
                status: function (res) {
                    this.resCode = res;
                    return this;
                }
            }
            
            ImageController.getImages({}, res, {});
    
            expect(res.images[0]).to.be.equal(undefined);
        });
    });
}) 