import { Router } from 'express';
import { formController } from '../controllers/index.js';

const router = Router();

router.route('/').get(formController.getForms); // get all forms
router.route('/create').post(formController.createForm);
router.route('/:formId').delete(formController.deleteForm);
router.route('/view/:formId').get(formController.getForm).post(formController.submitForm);
router.route('/responses/:formId').get(formController.getResponses);
router.route('/responses/:formId/:responseId').get(formController.getResponse);
router.route('/responses/:formId/:responseId').delete(formController.deleteForm);

export default router;