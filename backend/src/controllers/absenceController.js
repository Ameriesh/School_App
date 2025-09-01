const Absence = require("../models/Absence");
const Eleve = require("../models/Eleve");

// Ajouter une absence
exports.addAbsence = async (req, res) => {
  try {
    // Correction : injecter enseignantId depuis le middleware verifyEnseignant
    req.enseignantId = req.authUser?.mongoId;
    console.log("BODY:", req.body, "Enseignant:", req.enseignantId);
    const { eleve, date, statut, motif, heures } = req.body;
    const enseignant = req.enseignantId; // injecté par le middleware

    if (!eleve || !date || !statut || !motif || !heures) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    const absence = new Absence({ eleve, enseignant, date, statut, motif, heures });
    await absence.save();
    res.status(201).json({ message: "Absence ajoutée.", absence });
  } catch (error) {
    console.error("Erreur ajout absence:", error);
    res.status(500).json({ message: "Erreur lors de l'ajout.", error: error.message });
  }
};

// Lister les absences avec filtres et total par élève
exports.listAbsences = async (req, res) => {
  try {
    const { eleve, date, statut } = req.query;
    const enseignant = req.enseignantId;

    const filter = { enseignant };
    if (eleve) filter.eleve = eleve;
    if (date) filter.date = new Date(date);
    if (statut) filter.statut = statut;

    const absences = await Absence.find(filter)
      .populate("eleve", "nom prenom")
      .sort({ date: -1 });

    // Calcul du total d'heures d'absence par élève
    const totalAbsences = {};
    absences.forEach(abs => {
      const id = abs.eleve._id.toString();
      totalAbsences[id] = (totalAbsences[id] || 0) + (abs.heures || 0);
    });

    res.json({ absences, totalAbsences });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération.", error: error.message });
  }
};

// Lister toutes les absences (admin ou debug)
exports.listAllAbsences = async (req, res) => {
  try {
    const absences = await Absence.find()
      .populate("eleve", "nom prenom")
      .populate("enseignant", "nom prenom")
      .sort({ date: -1 });
    res.json({ absences });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération de toutes les absences.", error: error.message });
  }
};

// Modifier une absence
exports.updateAbsence = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut, motif, heures } = req.body;
    const enseignant = req.enseignantId;

    const absence = await Absence.findOneAndUpdate(
      { _id: id, enseignant },
      { statut, motif, heures },
      { new: true }
    );
    if (!absence) return res.status(404).json({ message: "Absence non trouvée." });
    res.json({ message: "Absence modifiée.", absence });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la modification.", error: error.message });
  }
};

// Supprimer une absence
exports.deleteAbsence = async (req, res) => {
  try {
    const { id } = req.params;
    const enseignant = req.enseignantId;

    const absence = await Absence.findOneAndDelete({ _id: id, enseignant });
    if (!absence) return res.status(404).json({ message: "Absence non trouvée." });
    res.json({ message: "Absence supprimée." });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression.", error: error.message });
  }
};

// Permettre au parent de voir les absences de son enfant
exports.getAbsencesForParent = async (req, res) => {
  try {
    const parentId = req.parentId; // injecté par le middleware
    const enfantId = req.params.enfantId;
    if (!enfantId) {
      return res.status(400).json({ message: "enfantId requis" });
    }
    // Vérifier que l'enfant appartient bien au parent
    const Eleve = require("../models/Eleve");
    const eleve = await Eleve.findOne({ _id: enfantId, parentId });
    if (!eleve) {
      return res.status(403).json({ message: "Cet enfant ne vous appartient pas." });
    }
    // Récupérer les absences de l'enfant
    const absences = await Absence.find({ eleve: enfantId })
      .populate("enseignant", "nom prenom")
      .sort({ date: -1 });
    res.json({ absences });
  } catch (error) {
    console.error('Erreur récupération absences enfant parent:', error);
    res.status(500).json({ message: "Erreur lors de la récupération des absences", error: error.message });
  }
}; 