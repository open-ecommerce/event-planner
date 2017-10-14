<?php

namespace backend\models;

use kartik\tree\TreeView;
use common\models\query\BookQuery;
use common\models\BookDeals;
use common\models\query\PublisherQuery;
use Yii;
use yii\db\ActiveRecord;
use common\models\UserProfile;
use dosamigos\taggable\Taggable;
use common\commands\AddToBookViewsCommand;
use common\models\Favorite;
use \yii\db\Expression;
use common\models\Author;
use common\models\Contact;
use common\models\Country;

/**
 * This is the model class for table "book".
 *
 * @property integer $id
 * @property string $slug
 * @property string $title
 * @property string $excerpt
 * @property string $body
 * @property string $notes
 * @property string $rights_information
 * @property string $view
 * @property string $thumbnail_base_url
 * @property string $thumbnail_path
 * @property string $manuscript_base_url
 * @property string $manuscript_path
 * @property array $attachments
 * @property integer publisher_id
 * @property integer category_id
 * @property integer author_id
 * @property integer $rights_owner_id
 * @property integer $status
 * @property integer $published_at
 * @property integer $created_by
 * @property integer $updated_by
 * @property integer $updated_at
 * @property integer $recommendation_id
 * @property string $recommendation
 * @property string $originality
 * @property integer $primary_agent
 * @property integer $us_agent_id
 * @property integer $translation_agent_id


 * @property User $report_by
 * @property User $creator
 * @property User $updater
 * @property Publisher $publisher
 * @property RightsOwner $rightsOwner
 * @property BookAttachment[] $bookAttachments
 */
class BookIndexDuplicated extends ActiveRecord {

    const STATUS_VISIBLE = 1;
    const STATUS_DRAFT = 0;

    /**
     * @var array
     */
    public $globalSearch;
    public $country_name;

public static function primaryKey()
{
    return ['id'];
}    
    
    /**
     * @inheritdoc
     */
    public static function tableName() {
        return 'view_duplicated_titles';
    }

    /**
     * @return BookQuery
     */
    public static function find() {
        return new BookQuery(get_called_class());
    }

    /**
     * @inheritdoc
     */
    public function behaviors() {
        return [
            [
                'class' => Taggable::className(),
            ],
        ];
    }

    /**
     * @inheritdoc
     */
    public function rules() {
        return [
            [['title', 'author_id'], 'required'],
            [['author_id'], 'exist', 'targetClass' => Author::className(), 'targetAttribute' => 'id'],
            [['slug'], 'unique'],
            [['body', 'ysk', 'recommendation_note'], 'string'],
            [['rating', 'recommendation_id', 'status', 'literary', 'originality', 'readability', 'all_can_see', 'official_submission', 'manuscript_size'], 'integer'],
            [['notes', 'rights_information', 'rights_tv_info', 'rights_film_info', 'rights_audio_info'], 'string'],
            [['published_at'], 'default', 'value' => function () {
                    return date(DATE_ISO8601);
                }],
            [['published_at'], 'filter', 'filter' => 'strtotime', 'skipOnEmpty' => true],
            [['publisher_id'], 'exist', 'targetClass' => Contact::className(), 'targetAttribute' => 'id'],
            [['primary_agent_id'], 'exist', 'targetClass' => Contact::className(), 'targetAttribute' => 'id'],
            [['us_agent_id'], 'exist', 'targetClass' => Contact::className(), 'targetAttribute' => 'id'],
            [['translation_agent_id'], 'exist', 'targetClass' => Contact::className(), 'targetAttribute' => 'id'],
            [['rights_owner_id'], 'exist', 'targetClass' => Contact::className(), 'targetAttribute' => 'id'],
            [['rights_film_id'], 'exist', 'targetClass' => Contact::className(), 'targetAttribute' => 'id'],
            [['rights_audio_id'], 'exist', 'targetClass' => Contact::className(), 'targetAttribute' => 'id'],
            [['rights_tv_id'], 'exist', 'targetClass' => Contact::className(), 'targetAttribute' => 'id'],
            [['rights_owner_id'], 'exist', 'targetClass' => Contact::className(), 'targetAttribute' => 'id'],
            [['rights_film_bought_id'], 'exist', 'targetClass' => Contact::className(), 'targetAttribute' => 'id'],
            [['rights_audio_bought_id'], 'exist', 'targetClass' => Contact::className(), 'targetAttribute' => 'id'],
            [['rights_tv_bought_id'], 'exist', 'targetClass' => Contact::className(), 'targetAttribute' => 'id'],
            [['recommendation_id'], 'exist', 'targetClass' => BookRecommendation::className(), 'targetAttribute' => 'id'],
            [['country_id'], 'exist', 'targetClass' => Country::className(), 'targetAttribute' => 'id'],
            [['slug', 'thumbnail_base_url', 'thumbnail_path', 'manuscript_base_url', 'manuscript_path'], 'string', 'max' => 1024],
            [['title'], 'string', 'max' => 512],
            [['excerpt', 'vibe', 'filmic', 'length', 'negatives', 'market', 'origin_comment'], 'string'],
            [['view', 'manuscript_name', 'manuscript_type'], 'string', 'max' => 255],
            [['counter'], 'safe'],
            [['attachments', 'thumbnail', 'manuscript'], 'safe'],
            [['category_id'], 'safe'],
            [['favorite', 'favorited', 'favoritedIcon', 'bookmark', 'bookmarked', 'submission'], 'safe'],
            [['categories_tree'], 'safe'],
            [['tagNames'], 'safe'],
            [['category'], 'safe'],
            [['recommendation'], 'safe'],
            [['otherCategories', 'allCategories'], 'safe'],
            [['reportName'], 'safe'],
            [['report_by'], 'exist', 'skipOnError' => true, 'targetClass' => UserProfile::className(), 'targetAttribute' => 'user_id'],
            [['globalSearch', 'country_name'], 'safe'],
            [['official_submission'], 'default', 'value' => 1],
            [['hot', 'hot_sticky', 'essential', 'essential_sticky', 'loved', 'loved_sticky'], 'integer'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels() {
        return [
            'id' => Yii::t('common', 'ID'),
            'slug' => Yii::t('common', 'Slug'),
            'title' => Yii::t('common', 'Title'),
            'author_id' => Yii::t('common', 'Author'),
            'excerpt' => Yii::t('common', 'Excerpt for carousel'),
            'body' => Yii::t('common', 'Main report content'),
            'recommendation_note' => Yii::t('common', 'Recommendation comment'),
            'recommendation_id' => Yii::t('common', 'Recommended'),
            'ysk' => Yii::t('common', 'Things you need to know'),
            'notes' => Yii::t('common', 'Internal Notes (not visible for clients)'),
            'counter' => Yii::t('common', 'Number of views'),
            'categories_tree' => Yii::t('common', 'Check the categories for this book'),
            'category_id' => Yii::t('common', 'Check the categories for this book'),
            'thumbnail' => Yii::t('common', 'Book Cover'),
            'manuscript' => Yii::t('common', 'Manuscript'),
            'publisher_id' => Yii::t('common', 'Publisher'),
            'primary_agent_id' => Yii::t('common', 'Primary Agent'),
            'us_agent_id' => Yii::t('common', 'US Agent'),
            'translation_agent_id' => Yii::t('common', 'Translation Agent'),
            'rights_owner_id' => Yii::t('common', 'Rights Owner'),
            'rights_tv_id' => Yii::t('common', 'TV Rights sold by'),
            'rights_tv_bought_id' => Yii::t('common', 'TV Rights bought by'),
            'rights_tv_info' => Yii::t('common', 'TV Rights Information'),
            'rights_film_id' => Yii::t('common', 'Film Rights sold by'),
            'rights_film_bought_id' => Yii::t('common', 'Film Rights bought by'),
            'rights_film_info' => Yii::t('common', 'Film Rights Information'),
            'rights_audio_id' => Yii::t('common', 'Audio Rights sold by'),
            'rights_audio_bought_id' => Yii::t('common', 'Audio Rights bought by'),
            'rights_audio_info' => Yii::t('common', 'Audio Rights Information'),
            'status' => Yii::t('common', 'Visible for clients'),
            'rights_information' => Yii::t('common', 'Rights Information'),
            'published_at' => Yii::t('common', 'Visible At'),
            'report_by' => Yii::t('common', 'Report By'),
            'created_by' => Yii::t('common', 'Creator'),
            'tagNames' => Yii::t('common', 'Select or create tags for this book'),
            'updated_by' => Yii::t('common', 'Updater'),
            'created_at' => Yii::t('common', 'Created At'),
            'updated_at' => Yii::t('common', 'Updated At'),
            'reportName' => Yii::t('common', 'Report By'),
            'rating' => Yii::t('common', 'General rating'),
            'literary' => Yii::t('common', 'Literary'),
            'redability' => Yii::t('common', 'Readability'),
            'originality' => Yii::t('common', 'Originality'),
            'vibe' => Yii::t('common', 'Vibe'),
            'filmic' => Yii::t('common', 'Filmic'),
            'length' => Yii::t('common', 'Length'),
            'negatives' => Yii::t('common', 'Negatives'),
            'all_can_see' => Yii::t('common', 'Visible for all clients'),
            'official_submission' => Yii::t('app', 'Official submission'),
            'country_id' => Yii::t('common', 'Country of origin'),
            'market' => Yii::t('common', 'Market/Comparative titles'),
            'hot' => Yii::t('common', 'Hot'),
            'hot_sticky' => Yii::t('common', 'Sticky'),
            'essential' => Yii::t('common', 'Essential'),
            'essential_sticky' => Yii::t('common', 'Sticky'),
            'loved' => Yii::t('common', 'Loved'),
            'loved_sticky' => Yii::t('common', 'Sticky'),
            'origin_comment' => Yii::t('common', 'Origin comment')
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getAuthor() {
        return $this->hasOne(Author::className(), ['id' => 'author_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getCreator() {
        return $this->hasOne(User::className(), ['id' => 'created_by']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getReportBy() {
        return $this->hasOne(UserProfile::className(), ['user_id' => 'report_by']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getUpdater() {
        return $this->hasOne(User::className(), ['id' => 'updated_by']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getRightsFilm() {
        return $this->hasOne(Contact::className(), ['id' => 'rights_film_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getRightsAudio() {
        return $this->hasOne(Contact::className(), ['id' => 'rights_audio_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getRightsTv() {
        return $this->hasOne(Contact::className(), ['id' => 'rights_tv_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getRightsFilmBoughtBy() {
        return $this->hasOne(Contact::className(), ['id' => 'rights_film_bought_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getRightsAudioBoughtBy() {
        return $this->hasOne(Contact::className(), ['id' => 'rights_audio_bought_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getRightsTvBoughtBy() {
        return $this->hasOne(Contact::className(), ['id' => 'rights_tv_bought_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getCategory() {
        return $this->hasOne(BookCategoryTree::className(), ['id' => 'category_id']);
    }

    public function getUsedCategory() {
        
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getOtherCategories() {
        $selected = explode(',', $this->categories_tree);
        $rows = BookCategoryTree::find()->where(['id' => $selected])
                ->orderBy('root')
                ->all();
        //$selectedCats = array();
        $selectedCats = '';
        if (!empty($rows)) {
            $lastRoot = 999;
            $parentName = '';
            foreach ($rows as $row) {
                if ($lastRoot != $row->root) {
                    $parent = BookCategoryTree::find()->where(['id' => $row->root])->one();
                    $parentName = $parent->name;
                    if (!empty($selectedCats)) {
                        $selectedCats .= '<br>';
                    }
                    $selectedCats .= $parentName . ": " . $row->name;
                    $lastRoot = $row->root;
                } else {
                    $selectedCats .= '/ ' . $row->name;
                }
            }
        }
        return $selectedCats;
    }

    public function getAllCategories() {
        $selectedCats = '';

        if (!empty($this->category_id)) {
            $rootCat = BookCategoryTree::find()->where(['id' => $this->category_id])->one();
            $parent = BookCategoryTree::find()->where(['id' => $rootCat->root])->one();
            $selectedCats .= '<strong>'.$parent->name . ": " . $this->category->name . '</strong>';
        }

        if (!empty($this->categories_tree)) {
            $selected = explode(',', $this->categories_tree);
            $rows = BookCategoryTree::find()->where(['id' => $selected])
                    ->orderBy('root')
                    ->all();
            if (!empty($rows)) {
                $lastRoot = 999;
                $parentName = '';
                foreach ($rows as $row) {
                    if ($lastRoot != $row->root) {
                        $parent = BookCategoryTree::find()->where(['id' => $row->root])->one();
                        $parentName = $parent->name;
                        if (!empty($selectedCats)) {
                            $selectedCats .= '<br>';
                        }
                        $selectedCats .= $parentName . ": " . $row->name;
                        $lastRoot = $row->root;
                    } else {
                        $selectedCats .= '/ ' . $row->name;
                    }
                }
            }
        }

        return $selectedCats;
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getBookAttachments() {
        return $this->hasMany(BookAttachment::className(), ['book_id' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getTags() {
        return $this->hasMany(Tag::className(), ['id' => 'tag_id'])->viaTable('book_tag_assn', ['book_id' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getUser() {
        return $this->hasOne(User::className(), ['id' => 'id_user']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getProfile() {
        return $this->hasOne(UserProfile::className(), ['user_id' => 'report_by']);
    }

    public function getReportFullname() {
        if (isset($this->profile->firstname)) {
            return $this->profile->firstname . " " . $this->profile->lastname;
        }
    }

    public function getFavorite() {
        $userID = Yii::$app->user->identity->id;
        return Favorite::find()->where(['user_id' => $userID, 'book_id' => $this->id])->one();
    }

    public function getFavorites() {
        $userID = Yii::$app->user->identity->id;
        return $this->hasMany(Favorite::className(), ['book_id' => 'id'], ['book_id' => $this->id]);
    }

    public function getFavoritedIcon() {
        if (isset($this->favorite)) {
            return '<i class="glyphicon glyphicon-asterisk books-form"></i>';
        } else {
            return '';
        }
    }

    public function getFavorited() {
        if (isset($this->favorite)) {
            return " active";
        } else {
            return " inactive";
        }
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getBookmark() {
        $userID = Yii::$app->user->identity->id;
        return Bookmark::find()->where(['user_id' => $userID])->andwhere(['bookmark_id' => $this->id])->one();
    }

    public function getBookmarked() {
        if (isset($this->bookmark)) {
            return " active";
        } else {
            return " inactive";
        }
    }

    public function getSubmission() {
        if (isset($this->official_submission)) {
            return "official submission";
        } else {
            return "unofficial submission";
        }
    }

    public function getUserDeal() {
        $formatter = \Yii::$app->formatter;
        $countryID = Yii::$app->user->identity->companyCountryId;
        $countryName = Yii::$app->user->identity->companyCountryName;
        $Deal = BookDeals::find()->where(['country_id' => $countryID])->andwhere(['book_id' => $this->id])->one();

        if (!empty($Deal)) {
            return '<span>' . $countryName . '</span> deal by <span>' . $Deal->contact->name . "</span> on <span>" . $formatter->asDate($Deal->deal_date, 'long') . '</span>';
        } else {
            return "Available in <span>" . Yii::$app->user->identity->companyCountryName . "</span>";
        }
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getRightsOwner() {
        return $this->hasOne(Contact::className(), ['id' => 'rights_owner_id']);
    }

    public function getPrimaryAgent() {
        return $this->hasOne(Contact::className(), ['id' => 'primary_agent_id']);
    }

    public function getUsAgent() {
        return $this->hasOne(Contact::className(), ['id' => 'us_agent_id']);
    }

    public function getTranslationAgent() {
        return $this->hasOne(Contact::className(), ['id' => 'translation_agent_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getPublisher() {
        return $this->hasOne(Contact::className(), ['id' => 'publisher_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getCountry() {
        return $this->hasOne(Country::className(), ['id' => 'country_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getRecommendation() {
        return $this->hasOne(BookRecommendation::className(), ['id' => 'recommendation_id']);
    }

    public function viewsCounter($model) {

        //$this->refresh();

        Book::updateAll(['counter' => $model->counter + 1], ['id' => $model->id]);

        Yii::$app->commandBus->handle(new \common\commands\AddToBookViewsCommand([
            'book_id' => $model->id
        ]));
    }

    public function getCarouselDescription() {
        // more drastic aproach
        // return (empty($this->excerpt) ? preg_replace('/(?:<|&lt;)\/?([a-zA-Z]+) *[^<\/]*?(?:>|&gt;)/', '', $this->body)."\n" : $this->excerpt );
        return (empty($this->excerpt) ? strip_tags(substr($this->body, 0, 100)) : $this->excerpt );
    }

    public function getCarouselBooks($carrousel, $sticky) {
        $userID = Yii::$app->user->identity->id;
        $currentUser = UserProfile::find()
                ->where(['user_id' => $userID])
                ->one();
        $integerIDs = array_map('intval', explode(',', $currentUser->categories_tree));
        $books = Book::find()
                ->published()
                ->where(['in', 'category_id', $integerIDs]);
        foreach ($integerIDs as $cat) {
            $books = $books->orWhere(new Expression('FIND_IN_SET(:category_to_find' . $cat . ', categories_tree)'))
                    ->addParams([':category_to_find' . $cat => $cat]);
        }
        $books = $books->andwhere([$carrousel => 1])
                ->orderBy([
                    $sticky => SORT_DESC,
                    'updated_at' => SORT_DESC,
                ])
                ->limit(10)
                ->all();
        return $books;
    }

   
}
