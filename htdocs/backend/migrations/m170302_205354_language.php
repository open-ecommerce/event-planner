<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_205354_language extends Migration
{

    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $tableOptions = 'ENGINE=InnoDB';

        $this->createTable(
            '{{%language}}',
            [
                'id'=> $this->primaryKey(11),
                'name'=> $this->text()->notNull(),
                'frequency'=> $this->integer(11)->notNull(),
                'short_name'=> $this->text()->notNull(),
            ],$tableOptions
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%language}}');
    }
}
