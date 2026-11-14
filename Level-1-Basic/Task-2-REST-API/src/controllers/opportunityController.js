const db = require('../config/db');

// Allowed opportunity categories as specified in project requirements
const VALID_TYPES = [
  'Internships',
  'Scholarships',
  'Remote jobs',
  'Training programs',
  'Fellowships',
];

/**
 * Helper to validate positive integer IDs
 */
const isValidId = (id) => {
  const parsed = parseInt(id, 10);
  return !isNaN(parsed) && parsed > 0 && parsed.toString() === id.toString();
};

/**
 * Helper to validate standard URL format
 */
const isValidUrl = (string) => {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
};

/**
 * Helper to validate date format (YYYY-MM-DD or valid parseable date)
 */
const isValidDate = (dateString) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  const d = new Date(dateString);
  return !isNaN(d.getTime());
};

/**
 * Validation function for Opportunity creation and update payloads
 */
const validateOpportunityInput = (data, isUpdate = false) => {
  const errors = [];
  const { title, organization, type, description, deadline, application_url } = data;

  if (!isUpdate || title !== undefined) {
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      errors.push('Title is required and must be a non-empty string.');
    } else if (title.trim().length > 200) {
      errors.push('Title cannot exceed 200 characters.');
    }
  }

  if (!isUpdate || organization !== undefined) {
    if (!organization || typeof organization !== 'string' || organization.trim().length === 0) {
      errors.push('Organization is required and must be a non-empty string.');
    } else if (organization.trim().length > 200) {
      errors.push('Organization cannot exceed 200 characters.');
    }
  }

  if (!isUpdate || type !== undefined) {
    if (!type || !VALID_TYPES.includes(type)) {
      errors.push(
        `Type is required and must be one of: ${VALID_TYPES.join(', ')}.`
      );
    }
  }

  if (!isUpdate || description !== undefined) {
    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      errors.push('Description is required and must be a non-empty string.');
    }
  }

  if (deadline) {
    if (!isValidDate(deadline)) {
      errors.push('Deadline must be a valid date in YYYY-MM-DD format.');
    }
  }

  if (application_url) {
    if (!isValidUrl(application_url)) {
      errors.push('Application URL must be a valid HTTP or HTTPS URL.');
    }
  }

  return errors;
};

// =============================================================================
// CONTROLLER HANDLERS
// =============================================================================

/**
 * @desc    Get all opportunities (with optional filtering & search)
 * @route   GET /api/opportunities
 * @access  Public
 */
const getAllOpportunities = async (req, res, next) => {
  try {
    const { type, field, search } = req.query;
    let queryText = 'SELECT * FROM opportunities';
    const queryParams = [];
    const conditions = [];

    if (type) {
      if (!VALID_TYPES.includes(type)) {
        return res.status(400).json({
          success: false,
          message: `Invalid type filter. Allowed types: ${VALID_TYPES.join(', ')}.`,
        });
      }
      queryParams.push(type);
      conditions.push(`type = $${queryParams.length}`);
    }

    if (field) {
      queryParams.push(field);
      conditions.push(`field ILIKE $${queryParams.length}`);
    }

    if (search) {
      queryParams.push(`%${search.trim()}%`);
      const searchIndex = queryParams.length;
      conditions.push(
        `(title ILIKE $${searchIndex} OR organization ILIKE $${searchIndex} OR description ILIKE $${searchIndex})`
      );
    }

    if (conditions.length > 0) {
      queryText += ' WHERE ' + conditions.join(' AND ');
    }

    queryText += ' ORDER BY created_at DESC, id DESC;';

    const result = await db.query(queryText, queryParams);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get single opportunity by ID
 * @route   GET /api/opportunities/:id
 * @access  Public
 */
const getOpportunityById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid opportunity ID. ID must be a positive integer.',
      });
    }

    const result = await db.query(
      'SELECT * FROM opportunities WHERE id = $1;',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Opportunity with ID ${id} not found.`,
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create a new opportunity
 * @route   POST /api/opportunities
 * @access  Public
 */
const createOpportunity = async (req, res, next) => {
  try {
    const errors = validateOpportunityInput(req.body, false);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed for opportunity creation.',
        errors,
      });
    }

    const {
      title,
      organization,
      type,
      field,
      description,
      eligibility,
      deadline,
      application_url,
      location,
    } = req.body;

    const insertQuery = `
      INSERT INTO opportunities (
        title,
        organization,
        type,
        field,
        description,
        eligibility,
        deadline,
        application_url,
        location
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;

    const values = [
      title.trim(),
      organization.trim(),
      type,
      field ? field.trim() : null,
      description.trim(),
      eligibility ? eligibility.trim() : null,
      deadline || null,
      application_url ? application_url.trim() : null,
      location ? location.trim() : null,
    ];

    const result = await db.query(insertQuery, values);

    res.status(201).json({
      success: true,
      message: 'Opportunity created successfully.',
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update an existing opportunity
 * @route   PUT /api/opportunities/:id
 * @access  Public
 */
const updateOpportunity = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid opportunity ID. ID must be a positive integer.',
      });
    }

    // Check if opportunity exists
    const checkResult = await db.query(
      'SELECT id FROM opportunities WHERE id = $1;',
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Opportunity with ID ${id} not found. Cannot update non-existent resource.`,
      });
    }

    // Validate body
    const errors = validateOpportunityInput(req.body, false);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed for opportunity update.',
        errors,
      });
    }

    const {
      title,
      organization,
      type,
      field,
      description,
      eligibility,
      deadline,
      application_url,
      location,
    } = req.body;

    const updateQuery = `
      UPDATE opportunities
      SET
        title = $1,
        organization = $2,
        type = $3,
        field = $4,
        description = $5,
        eligibility = $6,
        deadline = $7,
        application_url = $8,
        location = $9,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $10
      RETURNING *;
    `;

    const values = [
      title.trim(),
      organization.trim(),
      type,
      field ? field.trim() : null,
      description.trim(),
      eligibility ? eligibility.trim() : null,
      deadline || null,
      application_url ? application_url.trim() : null,
      location ? location.trim() : null,
      id,
    ];

    const result = await db.query(updateQuery, values);

    res.status(200).json({
      success: true,
      message: 'Opportunity updated successfully.',
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete an opportunity
 * @route   DELETE /api/opportunities/:id
 * @access  Public
 */
const deleteOpportunity = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid opportunity ID. ID must be a positive integer.',
      });
    }

    const result = await db.query(
      'DELETE FROM opportunities WHERE id = $1 RETURNING id;',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Opportunity with ID ${id} not found. Cannot delete non-existent resource.`,
      });
    }

    // Standard REST 204 No Content for successful deletion
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
};
