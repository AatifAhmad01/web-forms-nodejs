import { Router } from 'express';
import { formController } from '../controllers/index.js';

const router = Router();

router.route('/create').post(formController.createForm);
router.route('/forms').get(formController.getForms);
router.route('/view/:formId').get(formController.getForm).post(formController.submitForm);
router.route('/responses/:formId').get(formController.getResponses);
router.route('/responses/:formId/:responseId').get(formController.getResponse);
router.route('/responses/:formId/:responseId').delete(formController.deleteForm);

export default router;